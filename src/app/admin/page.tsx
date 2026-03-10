'use client';

import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import Link from 'next/link';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

const LazyRichTextEditor = lazy(() => import('@/components/RichTextEditor'));

function RichTextEditor(props: { content: string; onChange: (html: string) => void; placeholder?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[200px] animate-pulse rounded-lg bg-voraz-gray-100" />;
  return (
    <Suspense fallback={<div className="h-[200px] animate-pulse rounded-lg bg-voraz-gray-100" />}>
      <LazyRichTextEditor {...props} />
    </Suspense>
  );
}

// ── Types ──────────────────────────────────────────────────────

interface Correction {
  id: string;
  candidate_name: string;
  candidate_slug: string;
  email: string;
  message: string;
  correction_text: string;
  status: 'pending' | 'reviewed' | 'published' | 'rejected';
  created_at: string;
}

interface HealthIssue {
  candidate: string;
  candidateSlug: string;
  candidateParty: string;
  pillar: string;
  pillarKey: string;
  type: string;
  severity: 'error' | 'warning' | 'info';
  detail: string;
  currentText: string;
  score: string;
  sourceUrls: string[];
  sourceTitles: string[];
}

interface HealthData {
  healthScore: number;
  totalCandidates: number;
  totalSources: number;
  trustedSources: number;
  untrustedSources: number;
  truncatedCount: number;
  filteredSourcesCount: number;
  genericExplanations: number;
  domainBreakdown: Array<{ domain: string; count: number; trusted: boolean }>;
  issues: HealthIssue[];
  issueSummary: { errors: number; warnings: number; infos: number };
  trustedDomains: string[];
  checkedAt: string;
}

interface AiFixState {
  status: 'idle' | 'loading' | 'ready' | 'editing' | 'saved' | 'error';
  suggestion?: string;
  editedText?: string;
  error?: string;
}

interface SavedFix {
  id: string;
  candidateSlug: string;
  candidateName: string;
  pillar: string;
  pillarKey: string;
  issueType: string;
  originalText: string;
  fixedText: string;
  sourceUrls: string[];
  sourceTitles: string[];
  model: string;
  savedAt: string;
}

interface BatchResult {
  total: number;
  fixed: number;
  failed: number;
  fixes: Array<{
    candidateSlug: string;
    candidateName: string;
    pillar: string;
    pillarKey: string;
    issueType: string;
    originalText: string;
    fixedText: string;
    sourceUrls: string[];
    sourceTitles: string[];
    model: string;
    fixedAt: string;
  }>;
  errors: Array<{ candidate: string; pillar: string; error: string }>;
  completedAt: string;
}

const AI_FIXABLE_TYPES = ['truncated_text', 'generic_explanation', 'empty_explanation'];

function issueKey(issue: HealthIssue, index: number): string {
  return `${issue.candidateSlug}__${issue.pillarKey}__${issue.type}__${index}`;
}

function loadSavedFixes(): SavedFix[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('ai_fixes') || '[]');
  } catch {
    return [];
  }
}

function persistFixes(fixes: SavedFix[]) {
  localStorage.setItem('ai_fixes', JSON.stringify(fixes));
}

// Human-readable issue type labels
function issueTypeLabel(type: string): string {
  switch (type) {
    case 'truncated_text': return 'Texto incompleto';
    case 'generic_explanation': return 'Texto genérico';
    case 'empty_explanation': return 'Sin descripción';
    case 'filtered_source': return 'PDF oculto';
    case 'untrusted_source': return 'Fuente no oficial';
    case 'missing_sources': return 'Sin fuentes';
    case 'invalid_url': return 'URL rota';
    default: return type;
  }
}

function issueTypeColor(type: string): string {
  switch (type) {
    case 'truncated_text': return 'bg-amber-100 text-amber-700';
    case 'generic_explanation': return 'bg-blue-100 text-blue-700';
    case 'empty_explanation': return 'bg-red-100 text-red-700';
    case 'filtered_source': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

// ── Component ──────────────────────────────────────────────────

export default function AdminPage() {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [aiFixStates, setAiFixStates] = useState<Record<string, AiFixState>>({});
  const [savedFixes, setSavedFixes] = useState<SavedFix[]>([]);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [batchStatus, setBatchStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [batchProgress, setBatchProgress] = useState('');
  const [showAuditLog, setShowAuditLog] = useState(false);

  useEffect(() => {
    setSavedFixes(loadSavedFixes());
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [correctionsRes, healthRes] = await Promise.all([
        fetch('/api/analytics?period=all'),
        fetch('/api/health'),
      ]);
      if (correctionsRes.ok) {
        const data = await correctionsRes.json();
        setCorrections(data.corrections ?? []);
      }
      if (healthRes.ok) setHealth(await healthRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // ── AI Fix handlers ────────────────────────────────────────

  const handleAiFix = useCallback(async (issue: HealthIssue, key: string) => {
    setAiFixStates((prev) => ({ ...prev, [key]: { status: 'loading' } }));
    try {
      const res = await fetch('/api/ai-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: issue.candidate,
          candidateParty: issue.candidateParty,
          pillar: issue.pillarKey,
          pillarLabel: issue.pillar,
          issueType: issue.type,
          currentText: issue.currentText,
          score: issue.score,
          sourceUrls: issue.sourceUrls,
          sourceTitles: issue.sourceTitles,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error del servidor');
      }
      const data = await res.json();
      setAiFixStates((prev) => ({
        ...prev,
        [key]: { status: 'ready', suggestion: data.suggestion },
      }));
    } catch (err) {
      setAiFixStates((prev) => ({
        ...prev,
        [key]: { status: 'error', error: err instanceof Error ? err.message : 'Error' },
      }));
    }
  }, []);

  const handleApprove = useCallback(
    (issue: HealthIssue, key: string, text: string) => {
      const fix: SavedFix = {
        id: crypto.randomUUID(),
        candidateSlug: issue.candidateSlug,
        candidateName: issue.candidate,
        pillar: issue.pillar,
        pillarKey: issue.pillarKey,
        issueType: issue.type,
        originalText: issue.currentText,
        fixedText: text,
        sourceUrls: issue.sourceUrls,
        sourceTitles: issue.sourceTitles,
        model: 'gpt-4o-mini (manual)',
        savedAt: new Date().toISOString(),
      };
      const updated = [...savedFixes, fix];
      setSavedFixes(updated);
      persistFixes(updated);
      setAiFixStates((prev) => ({ ...prev, [key]: { status: 'saved' } }));
    },
    [savedFixes]
  );

  const handleEdit = useCallback((key: string) => {
    setAiFixStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], status: 'editing', editedText: prev[key]?.suggestion || '' },
    }));
  }, []);

  const handleDiscard = useCallback((key: string) => {
    setAiFixStates((prev) => ({ ...prev, [key]: { status: 'idle' } }));
  }, []);

  const handleSaveEdit = useCallback(
    (issue: HealthIssue, key: string) => {
      const text = aiFixStates[key]?.editedText || '';
      if (!text.trim()) return;
      handleApprove(issue, key, text);
    },
    [aiFixStates, handleApprove]
  );

  const handleExportCopy = useCallback(() => {
    const exportData = savedFixes.map((f) => ({
      candidateSlug: f.candidateSlug,
      pillar: f.pillarKey,
      field: 'explanation',
      value: f.fixedText,
    }));
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [savedFixes]);

  const handleClearFixes = useCallback(() => {
    setSavedFixes([]);
    persistFixes([]);
    setAiFixStates({});
    setShowExport(false);
  }, []);

  const hasSavedFix = useCallback(
    (issue: HealthIssue) =>
      savedFixes.some(
        (f) =>
          f.candidateSlug === issue.candidateSlug &&
          f.pillarKey === issue.pillarKey &&
          f.issueType === issue.type
      ),
    [savedFixes]
  );

  // Split issues into fixable and non-fixable (must be BEFORE handlers that reference them)
  const fixableIssues = health?.issues.filter((i) => AI_FIXABLE_TYPES.includes(i.type)) || [];
  const otherIssues = health?.issues.filter((i) => !AI_FIXABLE_TYPES.includes(i.type)) || [];
  const fixableCount = fixableIssues.length;
  const fixedCount = fixableIssues.filter((i) => hasSavedFix(i)).length;
  const unfixedCount = fixableCount - fixedCount;

  // ── Batch AI Fix ────────────────────────────────────────────

  const handleBatchFix = useCallback(async () => {
    if (batchStatus === 'running') return;
    setBatchStatus('running');
    setBatchProgress('Enviando a la IA...');
    try {
      const res = await fetch('/api/ai-fix-all', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error del servidor');
      }
      const batch: BatchResult = await res.json();
      setBatchProgress(`${batch.fixed} de ${batch.total} corregidos`);

      // Auto-approve all successful fixes and save to localStorage
      const newFixes: SavedFix[] = batch.fixes.map((f) => ({
        id: crypto.randomUUID(),
        candidateSlug: f.candidateSlug,
        candidateName: f.candidateName,
        pillar: f.pillar,
        pillarKey: f.pillarKey,
        issueType: f.issueType,
        originalText: f.originalText,
        fixedText: f.fixedText,
        sourceUrls: f.sourceUrls,
        sourceTitles: f.sourceTitles,
        model: f.model,
        savedAt: f.fixedAt,
      }));

      // Merge: overwrite existing fixes for same candidate+pillar, keep others
      const merged = [...savedFixes];
      for (const nf of newFixes) {
        const idx = merged.findIndex(
          (m) => m.candidateSlug === nf.candidateSlug && m.pillarKey === nf.pillarKey && m.issueType === nf.issueType
        );
        if (idx >= 0) merged[idx] = nf;
        else merged.push(nf);
      }
      setSavedFixes(merged);
      persistFixes(merged);

      // Mark all processed in UI as saved
      const newStates: Record<string, AiFixState> = {};
      for (const f of batch.fixes) {
        const matchIdx = fixableIssues.findIndex(
          (iss) => iss.candidateSlug === f.candidateSlug && iss.pillarKey === f.pillarKey && iss.type === f.issueType
        );
        if (matchIdx >= 0) {
          const k = issueKey(fixableIssues[matchIdx], matchIdx);
          newStates[k] = { status: 'saved' };
        }
      }
      setAiFixStates((prev) => ({ ...prev, ...newStates }));
      setBatchStatus('done');
    } catch (err) {
      setBatchProgress(err instanceof Error ? err.message : 'Error');
      setBatchStatus('idle');
    }
  }, [batchStatus, savedFixes, fixableIssues]);

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-voraz-black">
            Admin
          </h1>
          <p className="mt-2 text-sm text-voraz-gray-500">
            Panel de administración
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="rounded-lg bg-voraz-red text-voraz-white px-4 py-2 text-sm font-medium transition-colors hover:bg-voraz-red/90"
        >
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-voraz-red/10 border border-voraz-red/30 p-4">
          <p className="text-sm text-voraz-red">{error}</p>
          <p className="mt-2 text-xs text-voraz-gray-500">Nota: Conecta Supabase para ver datos reales</p>
        </div>
      )}

      {/* ═══ ANALYTICS DASHBOARD ═══ */}
      <div className="mb-8">
        <AnalyticsDashboard />
      </div>

      {/* ═══ HEALTH PANEL ═══ */}
      {health && (
        <div className="mb-6 space-y-6">
          {/* Score + overview card */}
          <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
                  Calidad de la data
                </h2>
                <p className="mt-1 text-xs text-voraz-gray-400">
                  Revisión automática de {health.totalCandidates} candidatos y {health.totalSources} fuentes
                </p>
              </div>
              {savedFixes.length > 0 && (
                <button
                  onClick={() => setShowExport(!showExport)}
                  className="flex items-center gap-2 rounded-full bg-voraz-black px-4 py-2 text-[11px] font-bold text-voraz-white transition-all hover:bg-voraz-gray-700"
                >
                  <span>Exportar {savedFixes.length} fix{savedFixes.length > 1 ? 'es' : ''}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
              )}
            </div>

            {/* Export panel */}
            {showExport && savedFixes.length > 0 && (
              <div className="mb-6 overflow-hidden rounded-xl bg-gray-950 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-400">
                    JSON listo para actualizar <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-green-400">candidates.ts</code>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportCopy}
                      className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {copied ? '✓ Copiado' : 'Copiar'}
                    </button>
                    <button
                      onClick={handleClearFixes}
                      className="rounded-full px-3.5 py-1.5 text-[11px] font-bold text-gray-500 transition-colors hover:text-red-400"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
                <pre className="max-h-44 overflow-auto text-[11px] font-mono leading-relaxed text-green-400">
                  {JSON.stringify(
                    savedFixes.map((f) => ({
                      candidateSlug: f.candidateSlug,
                      pillar: f.pillarKey,
                      field: 'explanation',
                      value: f.fixedText,
                    })),
                    null,
                    2
                  )}
                </pre>
              </div>
            )}

            {/* Score row */}
            <div className="flex items-center gap-5 mb-6 pb-6 border-b border-voraz-black/5">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-xl font-black text-white ${
                  health.healthScore === 100
                    ? 'bg-green-500'
                    : health.healthScore >= 80
                      ? 'bg-voraz-gold'
                      : 'bg-voraz-red'
                }`}
              >
                {health.healthScore}%
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-voraz-black">
                  {health.healthScore === 100
                    ? 'Todas las fuentes son oficiales'
                    : `${health.untrustedSources} fuente(s) no verificada(s)`}
                </p>
                <p className="mt-0.5 text-xs text-voraz-gray-400">
                  {fixableCount > 0 && (
                    <>
                      <span className="text-voraz-black font-semibold">{fixableCount - fixedCount}</span> textos por mejorar
                      {fixedCount > 0 && (
                        <span className="ml-2 text-green-600 font-semibold">· {fixedCount} corregido{fixedCount > 1 ? 's' : ''}</span>
                      )}
                    </>
                  )}
                </p>
              </div>
              {fixableCount > 0 && (
                <div className="hidden sm:flex items-center gap-1.5">
                  {Array.from({ length: fixableCount }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        i < fixedCount ? 'bg-green-400' : 'bg-voraz-black/10'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 3 metric cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  n: health.truncatedCount,
                  label: 'Incompletos',
                  desc: 'Terminan en "..."',
                  bad: 'text-amber-600',
                  bgBad: 'bg-amber-50 ring-amber-200/50',
                },
                {
                  n: health.filteredSourcesCount,
                  label: 'PDFs ocultos',
                  desc: 'No se muestran',
                  bad: 'text-orange-600',
                  bgBad: 'bg-orange-50 ring-orange-200/50',
                },
                {
                  n: health.genericExplanations,
                  label: 'Genéricos',
                  desc: 'Texto repetido',
                  bad: 'text-blue-600',
                  bgBad: 'bg-blue-50 ring-blue-200/50',
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className={`rounded-xl p-3.5 text-center ring-1 ${
                    m.n > 0 ? `${m.bgBad}` : 'bg-green-50 ring-green-200/50'
                  }`}
                >
                  <p className={`font-display text-2xl font-black ${m.n > 0 ? m.bad : 'text-green-600'}`}>
                    {m.n}
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold text-voraz-black">{m.label}</p>
                  <p className="text-[10px] text-voraz-gray-400">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Domains */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-voraz-gray-400">Fuentes</p>
              <div className="flex flex-wrap gap-2">
                {health.domainBreakdown.map((d) => (
                  <span
                    key={d.domain}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium ${
                      d.trusted
                        ? 'bg-green-50 text-green-700 ring-1 ring-green-200/50'
                        : 'bg-red-50 text-red-700 ring-1 ring-red-200/50'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${d.trusted ? 'bg-green-500' : 'bg-red-500'}`} />
                    {d.domain}
                    <span className="text-[10px] opacity-60">{d.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ FIXABLE ISSUES — AI correction flow ═══ */}
          {fixableIssues.length > 0 && (
            <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
              <div className="mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
                      Textos para mejorar
                    </h2>
                    <p className="mt-1 text-xs text-voraz-gray-400">
                      La IA puede sugerir correcciones. Tú revisas y apruebas.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {savedFixes.length > 0 && (
                      <button
                        onClick={() => setShowAuditLog(!showAuditLog)}
                        className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition-all ${
                          showAuditLog
                            ? 'bg-voraz-black text-white'
                            : 'bg-voraz-cream text-voraz-gray-500 hover:bg-voraz-black/10'
                        }`}
                      >
                        📋 Historial ({savedFixes.length})
                      </button>
                    )}
                    <span className="rounded-full bg-voraz-cream px-3 py-1 text-[11px] font-bold text-voraz-gray-500">
                      {fixedCount}/{fixableCount}
                    </span>
                  </div>
                </div>

                {/* Batch fix button */}
                {fixedCount < fixableCount && (
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={handleBatchFix}
                      disabled={batchStatus === 'running'}
                      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold shadow-sm transition-all active:scale-95 ${
                        batchStatus === 'running'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:shadow-md hover:brightness-110'
                      }`}
                    >
                      {batchStatus === 'running' ? (
                        <>
                          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z"/></svg>
                          Corregir todos con IA ({fixableCount - fixedCount} pendientes)
                        </>
                      )}
                    </button>
                    {batchStatus === 'running' && (
                      <span className="text-[11px] text-voraz-gray-400 animate-pulse">{batchProgress}</span>
                    )}
                    {batchStatus === 'done' && (
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-green-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {batchProgress}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* ── Audit Log ── */}
              {showAuditLog && savedFixes.length > 0 && (
                <div className="mb-5 rounded-xl border border-voraz-black/5 bg-voraz-cream/30 overflow-hidden">
                  <div className="px-4 py-3 border-b border-voraz-black/5 bg-voraz-cream/50">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-voraz-gray-500">
                        Historial de correcciones
                      </p>
                      <p className="text-[10px] text-voraz-gray-400">
                        {savedFixes.length} corrección{savedFixes.length > 1 ? 'es' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-voraz-black/5">
                    {[...savedFixes].reverse().map((fix) => (
                      <div key={fix.id} className="px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-voraz-black">{fix.candidateName}</span>
                            <span className="text-[10px] text-voraz-gray-400">· {fix.pillar}</span>
                            <span className={`rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${issueTypeColor(fix.issueType)}`}>
                              {issueTypeLabel(fix.issueType)}
                            </span>
                          </div>
                          <span className="text-[9px] text-voraz-gray-400">
                            {new Date(fix.savedAt).toLocaleDateString('es-PE', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {/* Before → After */}
                        <div className="rounded-lg overflow-hidden border border-voraz-black/5 text-[11px]">
                          {fix.originalText && (
                            <div className="bg-red-50/30 px-3 py-1.5 border-b border-voraz-black/5">
                              <span className="text-red-400 font-bold text-[9px]">ANTES: </span>
                              <span className="text-red-900/50 line-through">{fix.originalText.slice(0, 100)}{fix.originalText.length > 100 ? '…' : ''}</span>
                            </div>
                          )}
                          <div className="bg-green-50/30 px-3 py-1.5">
                            <span className="text-green-500 font-bold text-[9px]">DESPUÉS: </span>
                            <span className="text-green-900">{fix.fixedText}</span>
                          </div>
                        </div>
                        {/* Traceability */}
                        <div className="mt-1.5 flex items-center gap-3 text-[9px] text-voraz-gray-400">
                          <span>Modelo: {fix.model}</span>
                          {fix.sourceUrls.length > 0 && (
                            <span className="flex items-center gap-1">
                              Fuentes: {fix.sourceUrls.map((url, si) => {
                                let domain = '';
                                try { domain = new URL(url).hostname.replace('www.', ''); } catch { domain = 'link'; }
                                return (
                                  <a key={si} href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-voraz-black">
                                    {domain}
                                  </a>
                                );
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {fixableIssues.map((issue, i) => {
                  const key = issueKey(issue, i);
                  const fixState = aiFixStates[key] || { status: 'idle' };
                  const alreadyFixed = hasSavedFix(issue);

                  return (
                    <div
                      key={key}
                      className={`rounded-xl border transition-all ${
                        alreadyFixed || fixState.status === 'saved'
                          ? 'border-green-200 bg-green-50/30'
                          : fixState.status === 'ready' || fixState.status === 'editing'
                            ? 'border-voraz-black/10 bg-voraz-white shadow-lg'
                            : 'border-voraz-black/5 bg-voraz-white hover:border-voraz-black/15'
                      }`}
                    >
                      {/* Issue header */}
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`shrink-0 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${issueTypeColor(issue.type)}`}>
                            {issueTypeLabel(issue.type)}
                          </span>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-voraz-black">{issue.candidate}</span>
                            <span className="text-xs text-voraz-gray-400"> · {issue.pillar}</span>
                          </div>
                        </div>

                        {/* Action area */}
                        {alreadyFixed && fixState.status !== 'saved' ? (
                          <span className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-green-600">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Corregido
                          </span>
                        ) : fixState.status === 'idle' ? (
                          <button
                            onClick={() => handleAiFix(issue, key)}
                            className="shrink-0 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-3.5 py-1.5 text-[10px] font-bold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-95"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z"/></svg>
                            Mejorar con IA
                          </button>
                        ) : fixState.status === 'loading' ? (
                          <span className="shrink-0 flex items-center gap-2 text-[11px] text-voraz-gray-400">
                            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
                            Pensando...
                          </span>
                        ) : null}
                      </div>

                      {/* Current text preview + source links (when idle) */}
                      {fixState.status === 'idle' && !alreadyFixed && (
                        <div className="px-4 pb-3">
                          <p className="text-[11px] leading-relaxed text-voraz-gray-400 italic">
                            &ldquo;{issue.currentText.length > 120 ? issue.currentText.slice(0, 120) + '...' : issue.currentText}&rdquo;
                          </p>
                          {issue.sourceUrls.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {issue.sourceUrls.map((url, si) => {
                                let domain = '';
                                try { domain = new URL(url).hostname.replace('www.', ''); } catch { domain = 'link'; }
                                return (
                                  <a
                                    key={si}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[9px] font-medium text-voraz-gray-400 hover:text-voraz-black transition-colors"
                                  >
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    {domain}
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Error */}
                      {fixState.status === 'error' && (
                        <div className="mx-4 mb-3 flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
                          <p className="text-[11px] text-red-600">{fixState.error}</p>
                          <button
                            onClick={() => handleAiFix(issue, key)}
                            className="text-[11px] font-bold text-red-600 underline hover:text-red-800"
                          >
                            Reintentar
                          </button>
                        </div>
                      )}

                      {/* ── Suggestion: Before → After ── */}
                      {fixState.status === 'ready' && fixState.suggestion && (
                        <div className="mx-4 mb-4">
                          {/* Before/After comparison */}
                          <div className="rounded-xl overflow-hidden border border-voraz-black/5">
                            {/* Before */}
                            <div className="bg-red-50/50 px-4 py-3 border-b border-voraz-black/5">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-500">−</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Actual</span>
                              </div>
                              <p className="text-xs leading-relaxed text-red-900/60 line-through decoration-red-300/50">
                                {issue.currentText}
                              </p>
                            </div>
                            {/* After */}
                            <div className="bg-green-50/50 px-4 py-3">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-[10px] font-bold text-green-600">+</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">Sugerencia IA</span>
                              </div>
                              <p className="text-xs leading-relaxed text-green-900">
                                {fixState.suggestion}
                              </p>
                            </div>
                          </div>

                          {/* Verify sources — so you can fact-check before approving */}
                          {issue.sourceUrls.length > 0 && (
                            <div className="mt-2.5 rounded-lg bg-voraz-cream/50 px-3 py-2.5">
                              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-voraz-gray-400">
                                Verificar antes de aprobar
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {issue.sourceUrls.map((url, si) => {
                                  let label = issue.sourceTitles[si] || 'Fuente';
                                  // Shorten label
                                  if (label.length > 35) label = label.slice(0, 32) + '…';
                                  return (
                                    <a
                                      key={si}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 rounded-full bg-voraz-white px-2.5 py-1 text-[10px] font-medium text-voraz-gray-600 ring-1 ring-voraz-black/10 transition-all hover:ring-voraz-black/25 hover:text-voraz-black"
                                    >
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                      {label}
                                    </a>
                                  );
                                })}
                                <a
                                  href={`/c/${issue.candidateSlug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full bg-voraz-black/5 px-2.5 py-1 text-[10px] font-medium text-voraz-gray-500 transition-all hover:bg-voraz-black/10 hover:text-voraz-black"
                                >
                                  Ver ficha en Octógonos →
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(issue, key, fixState.suggestion!)}
                              className="rounded-full bg-green-600 px-4 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-green-700 active:scale-95"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleEdit(key)}
                              className="rounded-full bg-voraz-cream px-4 py-1.5 text-[10px] font-bold text-voraz-black ring-1 ring-voraz-black/10 transition-all hover:bg-gray-100 active:scale-95"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDiscard(key)}
                              className="rounded-full px-4 py-1.5 text-[10px] font-bold text-voraz-gray-400 transition-colors hover:text-voraz-red"
                            >
                              Descartar
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── Editing mode ── */}
                      {fixState.status === 'editing' && (
                        <div className="mx-4 mb-4">
                          <div className="rounded-xl border border-voraz-black/10 overflow-hidden">
                            {/* Original — collapsed */}
                            <div className="bg-voraz-cream/30 px-4 py-2 border-b border-voraz-black/5">
                              <p className="text-[10px] text-voraz-gray-400">
                                <span className="font-bold uppercase tracking-wider">Original:</span>{' '}
                                {issue.currentText.slice(0, 80)}{issue.currentText.length > 80 ? '...' : ''}
                              </p>
                            </div>
                            {/* Edit area */}
                            <div className="p-3">
                              <textarea
                                className="w-full resize-none rounded-lg border-0 bg-transparent p-0 text-xs leading-relaxed text-voraz-gray-700 placeholder:text-voraz-gray-300 focus:outline-none focus:ring-0"
                                rows={4}
                                placeholder="Escribe la corrección..."
                                value={fixState.editedText || ''}
                                onChange={(e) =>
                                  setAiFixStates((prev) => ({
                                    ...prev,
                                    [key]: { ...prev[key], editedText: e.target.value },
                                  }))
                                }
                              />
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => handleSaveEdit(issue, key)}
                              className="rounded-full bg-green-600 px-4 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-green-700 active:scale-95"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => handleDiscard(key)}
                              className="rounded-full px-4 py-1.5 text-[10px] font-bold text-voraz-gray-400 transition-colors hover:text-voraz-red"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── Saved confirmation ── */}
                      {fixState.status === 'saved' && (
                        <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"/></svg>
                          <span className="text-[11px] font-medium text-green-700">Corrección guardada — aparecerá en la exportación</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ OTHER ISSUES (non-fixable) ═══ */}
          {otherIssues.length > 0 && (
            <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between">
                  <div>
                    <h2 className="font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
                      Otras observaciones
                    </h2>
                    <p className="mt-1 text-xs text-voraz-gray-400">
                      PDFs ocultos y otros issues que no se corrigen con IA
                    </p>
                  </div>
                  <span className="rounded-full bg-voraz-cream px-3 py-1 text-[11px] font-bold text-voraz-gray-500 group-open:hidden">
                    {otherIssues.length}
                  </span>
                </summary>
                <div className="mt-4 space-y-1.5 max-h-64 overflow-y-auto">
                  {otherIssues.map((issue, i) => (
                    <div
                      key={`other-${i}`}
                      className="flex items-start gap-3 rounded-lg bg-voraz-cream/40 px-3 py-2 text-[11px]"
                    >
                      <span className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${issueTypeColor(issue.type)}`}>
                        {issueTypeLabel(issue.type)}
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-voraz-black">{issue.candidate}</span>
                        <span className="text-voraz-gray-400"> · {issue.pillar}</span>
                        <p className="text-voraz-gray-500">{issue.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      )}


      {/* ═══ CORRECTIONS LIST ═══ */}
      {!loading && (
        <div className="mt-6 rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
            Correcciones recibidas
          </h2>
          {corrections.length === 0 ? (
            <p className="text-xs text-voraz-gray-400">No hay correcciones</p>
          ) : (
            <div className="space-y-3">
              {corrections.map((c) => (
                <div key={c.id} className="rounded-xl bg-voraz-cream/60 p-4 ring-1 ring-voraz-black/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-voraz-black">{c.candidate_name}</span>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            c.status === 'pending'
                              ? 'bg-voraz-gold/20 text-voraz-gold'
                              : c.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : c.status === 'rejected'
                                  ? 'bg-voraz-red/10 text-voraz-red'
                                  : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-voraz-gray-400">
                        {new Date(c.created_at).toLocaleDateString('es-PE', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                        {' · '}{c.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-voraz-gray-400">Problema reportado</p>
                      <p className="mt-0.5 text-sm text-voraz-gray-600">{c.message}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-voraz-gray-400">Corrección sugerida</p>
                      <p className="mt-0.5 text-sm text-voraz-gray-600">{c.correction_text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Legal Pages Editor ── */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
            Páginas legales
          </span>
          <div className="h-px flex-1 bg-voraz-gray-200" />
        </div>
        <div className="space-y-4">
          <LegalPageEditor slug="terminos" label="Términos y Condiciones" />
          <LegalPageEditor slug="privacidad" label="Política de Privacidad" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-voraz-gray-400 transition-colors hover:text-voraz-black">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}

/* ── Legal Page Editor Component ── */

function LegalPageEditor({ slug, label }: { slug: string; label: string }) {
  const [title, setTitle] = useState(label);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load existing content
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/pages?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title || label);
          setContent(data.content || '');
          setLastUpdated(data.updated_at || null);
        }
      } catch {
        // Page doesn't exist yet, that's fine
      }
      setLoading(false);
    }
    load();
  }, [slug, label]);

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/pages/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, content }),
      });
      if (res.ok) {
        const data = await res.json();
        setLastUpdated(data.data?.updated_at || new Date().toISOString());
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setSaving(false);
  };

  return (
    <div className="rounded-2xl bg-voraz-white p-5 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
          {label}
        </h3>
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-voraz-red hover:underline"
        >
          Ver página ↗
        </a>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-voraz-gray-400">Cargando...</p>
      ) : (
        <>
          <div className="mb-3">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-voraz-gray-400">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-voraz-gray-200 px-3 py-2 text-sm text-voraz-black placeholder:text-voraz-gray-400 focus:border-voraz-red focus:outline-none focus:ring-1 focus:ring-voraz-red"
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-voraz-gray-400">
              Contenido
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Pega aquí tu texto legal (acepta copy-paste con estilos)..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[10px] text-voraz-gray-400">
              {lastUpdated && (
                <span>
                  Última actualización:{' '}
                  {new Date(lastUpdated).toLocaleDateString('es-PE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {status === 'saved' && (
                <span className="text-[11px] font-medium text-score-bajo">Guardado</span>
              )}
              {status === 'error' && (
                <span className="text-[11px] font-medium text-voraz-red">Error al guardar</span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-voraz-red px-4 py-2 text-xs font-bold text-voraz-white transition-colors hover:bg-voraz-red/90 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
