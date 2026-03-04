'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

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

interface Analytics {
  totalPageViews: number;
  totalCorrectionsFiled: number;
  uniqueVisitors: number;
  mostViewedCandidates: Array<{ name: string; views: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  corrections: Correction[];
  lastUpdated: string;
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
  savedAt: string;
}

// Issue types that AI can fix
const AI_FIXABLE_TYPES = ['truncated_text', 'generic_explanation', 'empty_explanation'];

// Stable key for each issue
function issueKey(issue: HealthIssue, index: number): string {
  return `${issue.candidateSlug}__${issue.pillarKey}__${issue.type}__${index}`;
}

// localStorage helpers
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

// ── Component ──────────────────────────────────────────────────

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI fix state
  const [aiFixStates, setAiFixStates] = useState<Record<string, AiFixState>>({});
  const [savedFixes, setSavedFixes] = useState<SavedFix[]>([]);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load saved fixes from localStorage
  useEffect(() => {
    setSavedFixes(loadSavedFixes());
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [analyticsRes, healthRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/health'),
      ]);
      if (!analyticsRes.ok) throw new Error('Failed to fetch analytics');
      setAnalytics(await analyticsRes.json());
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

  // Check if an issue already has a saved fix
  const hasSavedFix = useCallback(
    (issue: HealthIssue) =>
      savedFixes.some(
        (f) => f.candidateSlug === issue.candidateSlug && f.pillarKey === issue.pillarKey && f.issueType === issue.type
      ),
    [savedFixes]
  );

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-voraz-black">
            Admin
          </h1>
          <p className="mt-2 text-sm text-voraz-gray-500">
            Insights y datos de uso del sitio
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
          <p className="mt-2 text-xs text-voraz-gray-500">
            Nota: Conecta Supabase para ver datos reales
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-voraz-gray-500">Cargando datos...</p>
        </div>
      ) : !analytics ? (
        <div className="rounded-2xl bg-voraz-white p-8 text-center shadow-[var(--shadow-card)]">
          <p className="text-voraz-gray-500">Sin datos disponibles</p>
          <p className="mt-2 text-xs text-voraz-gray-400">
            Configure Supabase para ver analytics
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: 'Vistas de página', value: analytics.totalPageViews, color: 'text-voraz-red' },
            { label: 'Visitantes únicos', value: analytics.uniqueVisitors, color: 'text-voraz-black' },
            { label: 'Correcciones enviadas', value: analytics.totalCorrectionsFiled, color: 'text-voraz-gold' },
            {
              label: 'Última actualización',
              value: new Date(analytics.lastUpdated).toLocaleDateString('es-PE'),
              color: 'text-voraz-gray-500',
            },
          ].map((metric) => (
            <div key={metric.label} className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-voraz-gray-500">
                {metric.label}
              </p>
              <p className={`mt-2 font-display text-3xl font-black ${metric.color}`}>
                {typeof metric.value === 'number' ? metric.value.toLocaleString('es-PE') : metric.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Health panel ─────────────────────────────────── */}
      {health && (
        <div className="mb-6 rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
              Calidad de la data
            </h2>
            {savedFixes.length > 0 && (
              <button
                onClick={() => setShowExport(!showExport)}
                className="rounded-lg bg-voraz-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-voraz-white transition-colors hover:bg-voraz-gray-700"
              >
                Exportar correcciones ({savedFixes.length})
              </button>
            )}
          </div>
          <p className="mb-5 text-xs text-voraz-gray-400">
            Revisamos automáticamente que toda la info del sitio venga de fuentes oficiales y esté completa.
          </p>

          {/* Export panel */}
          {showExport && savedFixes.length > 0 && (
            <div className="mb-5 rounded-xl bg-voraz-cream/80 p-4 ring-1 ring-voraz-black/10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-voraz-black">
                  {savedFixes.length} corrección{savedFixes.length > 1 ? 'es' : ''} lista{savedFixes.length > 1 ? 's' : ''} para exportar
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportCopy}
                    className="rounded-lg bg-voraz-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-voraz-white transition-colors hover:bg-voraz-gray-700"
                  >
                    {copied ? '¡Copiado!' : 'Copiar JSON'}
                  </button>
                  <button
                    onClick={handleClearFixes}
                    className="rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-voraz-gray-400 transition-colors hover:text-voraz-red"
                  >
                    Limpiar todo
                  </button>
                </div>
              </div>
              <pre className="max-h-48 overflow-auto rounded-lg bg-voraz-black p-3 text-[11px] leading-relaxed text-green-400">
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
              <p className="mt-2 text-[10px] text-voraz-gray-400">
                Pega este JSON en un script para actualizar candidates.ts automáticamente.
              </p>
            </div>
          )}

          {/* Main score */}
          <div className="mb-6 flex items-center gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-2xl font-black text-white ${
                health.healthScore === 100
                  ? 'bg-green-500'
                  : health.healthScore >= 80
                    ? 'bg-voraz-gold'
                    : 'bg-voraz-red'
              }`}
            >
              {health.healthScore}%
            </div>
            <div>
              <p className="text-sm font-bold text-voraz-black">
                {health.healthScore === 100
                  ? 'Todos los links son de fuentes oficiales'
                  : `${health.untrustedSources} link(s) no son de fuentes oficiales`}
              </p>
              <p className="mt-0.5 text-xs text-voraz-gray-400">
                Revisamos {health.totalSources} links de {health.totalCandidates} candidatos
              </p>
            </div>
          </div>

          {/* 3 audit cards */}
          <div className="mb-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-voraz-gray-400">
              Cosas que revisamos
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className={`rounded-xl p-4 ${health.truncatedCount > 0 ? 'bg-voraz-gold/10 ring-1 ring-voraz-gold/20' : 'bg-green-50 ring-1 ring-green-200/50'}`}>
                <p className={`font-display text-2xl font-black ${health.truncatedCount > 0 ? 'text-voraz-gold' : 'text-green-600'}`}>
                  {health.truncatedCount}
                </p>
                <p className="mt-1 text-xs font-bold text-voraz-black">Descripciones incompletas</p>
                <p className="mt-1 text-[11px] leading-snug text-voraz-gray-400">
                  {health.truncatedCount > 0
                    ? 'Textos que terminan en "..." porque se cortaron al extraer la data. Habría que completarlos.'
                    : 'Todas las descripciones están completas.'}
                </p>
              </div>
              <div className={`rounded-xl p-4 ${health.filteredSourcesCount > 0 ? 'bg-voraz-gold/10 ring-1 ring-voraz-gold/20' : 'bg-green-50 ring-1 ring-green-200/50'}`}>
                <p className={`font-display text-2xl font-black ${health.filteredSourcesCount > 0 ? 'text-voraz-gold' : 'text-green-600'}`}>
                  {health.filteredSourcesCount}
                </p>
                <p className="mt-1 text-xs font-bold text-voraz-black">Links de PDFs ocultos</p>
                <p className="mt-1 text-[11px] leading-snug text-voraz-gray-400">
                  {health.filteredSourcesCount > 0
                    ? 'Links a "Resumen del plan" (PDFs del JNE) que tenemos en la data pero no se muestran al usuario porque dan error.'
                    : 'Todos los links de fuentes se muestran al usuario.'}
                </p>
              </div>
              <div className={`rounded-xl p-4 ${health.genericExplanations > 0 ? 'bg-blue-50 ring-1 ring-blue-200/50' : 'bg-green-50 ring-1 ring-green-200/50'}`}>
                <p className={`font-display text-2xl font-black ${health.genericExplanations > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                  {health.genericExplanations}
                </p>
                <p className="mt-1 text-xs font-bold text-voraz-black">Textos copiados iguales</p>
                <p className="mt-1 text-[11px] leading-snug text-voraz-gray-400">
                  {health.genericExplanations > 0
                    ? 'Descripciones que dicen lo mismo para varios candidatos (ej: "No se encontró plan de gobierno"). No son específicas.'
                    : 'Todas las descripciones son específicas de cada candidato.'}
                </p>
              </div>
            </div>
          </div>

          {/* Domain breakdown */}
          <div className="mb-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-voraz-gray-400">
              De dónde sacamos la data
            </p>
            <div className="space-y-2">
              {health.domainBreakdown.map((d) => (
                <div key={d.domain} className="flex items-center justify-between rounded-lg bg-voraz-cream/60 px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${d.trusted ? 'bg-green-500' : 'bg-voraz-red'}`} />
                    <div>
                      <span className="text-xs font-medium text-voraz-black">{d.domain}</span>
                      <span className="ml-2 text-[10px] text-voraz-gray-400">
                        {d.trusted ? '(oficial)' : '(no verificado)'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-voraz-gray-500">
                    {d.count} {d.count === 1 ? 'link' : 'links'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed issues with AI fix */}
          {health.issues.length > 0 && (
            <details className="group" open>
              <summary className="mb-2 cursor-pointer select-none text-[10px] font-bold uppercase tracking-[0.15em] text-voraz-gray-400 hover:text-voraz-black">
                Ver detalle por candidato ({health.issues.length} observaciones)
                <span className="ml-1 transition-transform group-open:rotate-90">{'▸'}</span>
              </summary>
              <div className="flex gap-3 mb-3 text-[11px]">
                {health.issueSummary.errors > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-voraz-red/10 px-2.5 py-1 font-medium text-voraz-red">
                    <span className="h-1.5 w-1.5 rounded-full bg-voraz-red" />
                    {health.issueSummary.errors} importante{health.issueSummary.errors > 1 ? 's' : ''}
                  </span>
                )}
                {health.issueSummary.warnings > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-voraz-gold/10 px-2.5 py-1 font-medium text-voraz-gold">
                    <span className="h-1.5 w-1.5 rounded-full bg-voraz-gold" />
                    {health.issueSummary.warnings} aviso{health.issueSummary.warnings > 1 ? 's' : ''}
                  </span>
                )}
                {health.issueSummary.infos > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    {health.issueSummary.infos} nota{health.issueSummary.infos > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="max-h-[32rem] space-y-2 overflow-y-auto rounded-xl bg-voraz-cream/40 p-3">
                {health.issues.map((issue, i) => {
                  const key = issueKey(issue, i);
                  const fixState = aiFixStates[key] || { status: 'idle' };
                  const canFix = AI_FIXABLE_TYPES.includes(issue.type);
                  const alreadyFixed = hasSavedFix(issue);

                  return (
                    <div
                      key={key}
                      className={`rounded-lg px-3 py-2.5 text-[11px] ${
                        issue.severity === 'error'
                          ? 'bg-voraz-red/5'
                          : issue.severity === 'warning'
                            ? 'bg-voraz-gold/5'
                            : 'bg-blue-50/60'
                      }`}
                    >
                      {/* Issue header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <span
                            className={`mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                              issue.severity === 'error'
                                ? 'bg-voraz-red'
                                : issue.severity === 'warning'
                                  ? 'bg-voraz-gold'
                                  : 'bg-blue-400'
                            }`}
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-voraz-black">{issue.candidate}</span>
                            <span className="text-voraz-gray-400"> en {issue.pillar}</span>
                            <p className="mt-0.5 text-voraz-gray-500">{issue.detail}</p>
                          </div>
                        </div>

                        {/* AI fix button */}
                        {canFix && !alreadyFixed && fixState.status === 'idle' && (
                          <button
                            onClick={() => handleAiFix(issue, key)}
                            className="shrink-0 rounded-lg bg-voraz-black px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-voraz-white transition-all hover:bg-voraz-gray-700"
                          >
                            Corregir con IA
                          </button>
                        )}
                        {canFix && alreadyFixed && fixState.status !== 'saved' && (
                          <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-700">
                            Corregido
                          </span>
                        )}
                      </div>

                      {/* Loading state */}
                      {fixState.status === 'loading' && (
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-voraz-cream/80 p-3">
                          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-voraz-black/20 border-t-voraz-black" />
                          <span className="text-xs text-voraz-gray-500">Generando sugerencia...</span>
                        </div>
                      )}

                      {/* Error state */}
                      {fixState.status === 'error' && (
                        <div className="mt-2 rounded-lg bg-voraz-red/5 p-3">
                          <p className="text-xs text-voraz-red">{fixState.error}</p>
                          <button
                            onClick={() => handleAiFix(issue, key)}
                            className="mt-1 text-[10px] font-bold text-voraz-gray-500 underline hover:text-voraz-black"
                          >
                            Reintentar
                          </button>
                        </div>
                      )}

                      {/* Suggestion ready */}
                      {fixState.status === 'ready' && fixState.suggestion && (
                        <div className="mt-2 rounded-lg bg-green-50 p-3 ring-1 ring-green-200/50">
                          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-green-700">
                            Sugerencia de IA
                          </p>
                          <p className="text-xs leading-relaxed text-voraz-gray-600">
                            {fixState.suggestion}
                          </p>
                          <div className="mt-2.5 flex gap-2">
                            <button
                              onClick={() => handleApprove(issue, key, fixState.suggestion!)}
                              className="rounded-md bg-green-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-green-700"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleEdit(key)}
                              className="rounded-md bg-voraz-cream px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-voraz-black ring-1 ring-voraz-black/10 transition-colors hover:bg-voraz-gray-100"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDiscard(key)}
                              className="rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-voraz-gray-400 transition-colors hover:text-voraz-red"
                            >
                              Descartar
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Editing state */}
                      {fixState.status === 'editing' && (
                        <div className="mt-2 rounded-lg bg-voraz-cream/80 p-3 ring-1 ring-voraz-black/10">
                          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-voraz-gray-500">
                            Editar sugerencia
                          </p>
                          <textarea
                            className="w-full rounded-md border border-voraz-gray-200 bg-voraz-white p-2 text-xs leading-relaxed text-voraz-gray-600 focus:border-voraz-black focus:outline-none"
                            rows={3}
                            value={fixState.editedText || ''}
                            onChange={(e) =>
                              setAiFixStates((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], editedText: e.target.value },
                              }))
                            }
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(issue, key)}
                              className="rounded-md bg-green-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-green-700"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => handleDiscard(key)}
                              className="rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-voraz-gray-400 transition-colors hover:text-voraz-red"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Saved state */}
                      {fixState.status === 'saved' && (
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-50 p-2.5">
                          <span className="text-green-600">✓</span>
                          <span className="text-xs font-medium text-green-700">Corrección guardada</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </details>
          )}

          {health.issues.length === 0 && (
            <p className="text-sm text-green-600">
              Todo bien — no encontramos problemas en la data.
            </p>
          )}
        </div>
      )}

      {/* ── Tables ───────────────────────────────────────── */}
      {analytics && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
              Candidatos más vistos
            </h2>
            <div className="space-y-3">
              {analytics.mostViewedCandidates.length === 0 ? (
                <p className="text-xs text-voraz-gray-400">Sin datos</p>
              ) : (
                analytics.mostViewedCandidates.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-voraz-gray-600">{c.name}</span>
                    <span className="font-bold text-voraz-red">{c.views}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
              Top referrers
            </h2>
            <div className="space-y-3">
              {analytics.topReferrers.length === 0 ? (
                <p className="text-xs text-voraz-gray-400">Sin datos</p>
              ) : (
                analytics.topReferrers.map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-voraz-gray-600">{r.referrer || 'Direct'}</span>
                    <span className="font-bold text-voraz-black">{r.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Corrections list ─────────────────────────────── */}
      {analytics && (
        <div className="mt-6 rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
            Correcciones recibidas
          </h2>
          {analytics.corrections.length === 0 ? (
            <p className="text-xs text-voraz-gray-400">No hay correcciones</p>
          ) : (
            <div className="space-y-3">
              {analytics.corrections.map((c) => (
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
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' · '}
                        {c.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-voraz-gray-400">
                        Problema reportado
                      </p>
                      <p className="mt-0.5 text-sm text-voraz-gray-600">{c.message}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-voraz-gray-400">
                        Corrección sugerida
                      </p>
                      <p className="mt-0.5 text-sm text-voraz-gray-600">{c.correction_text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-voraz-gray-400 transition-colors hover:text-voraz-black">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
