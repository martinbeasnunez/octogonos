import { candidates } from '@/data/candidates';
import { NextResponse } from 'next/server';

// Only these domains are trusted sources
const TRUSTED_DOMAINS = [
  'votoinformado.jne.gob.pe',
  'enlinea.sunedu.gob.pe',
  'cej.pj.gob.pe',
  'mpesije.jne.gob.pe',
];

type IssueType =
  | 'untrusted_source'
  | 'missing_sources'
  | 'empty_explanation'
  | 'invalid_url'
  | 'truncated_text'
  | 'filtered_source'
  | 'generic_explanation';

type IssueSeverity = 'error' | 'warning' | 'info';

interface Issue {
  candidate: string;
  candidateSlug: string;
  candidateParty: string;
  pillar: string;
  pillarKey: string;
  type: IssueType;
  severity: IssueSeverity;
  detail: string;
  currentText: string;
  score: string;
  sourceUrls: string[];
  sourceTitles: string[];
}

export async function GET() {
  const issues: Issue[] = [];
  const pillarNames = { education: 'Educación', legal: 'Legal', plan: 'Plan de gob.' };
  const sourceDomainCount: Record<string, number> = {};
  let totalSources = 0;
  let trustedSources = 0;
  let truncatedCount = 0;
  let filteredSourcesCount = 0;
  let genericExplanations = 0;

  // Generic explanations that are not candidate-specific
  const GENERIC_LEGAL_TEXTS = [
    'Tiene anotaciones en su declaración ante el JNE. Revisa la fuente.',
    'Sin alertas en su declaración ante el JNE.',
  ];

  const GENERIC_PLAN_TEXTS = [
    'No se encontró plan de gobierno registrado ante el JNE.',
  ];

  for (const c of candidates) {
    for (const pillarKey of ['education', 'legal', 'plan'] as const) {
      const pillar = c[pillarKey];
      const pillarLabel = pillarNames[pillarKey];

      // Shared context for every issue from this candidate+pillar
      const ctx = {
        candidateSlug: c.slug,
        candidateParty: c.party,
        pillarKey,
        currentText: pillar.explanation || '',
        score: pillar.score,
        sourceUrls: pillar.sources?.map((s) => s.url) || [],
        sourceTitles: pillar.sources?.map((s) => s.title) || [],
      };

      // Check empty explanation
      if (!pillar.explanation || pillar.explanation.trim().length < 5) {
        issues.push({
          candidate: c.name,
          pillar: pillarLabel,
          type: 'empty_explanation',
          severity: 'error',
          detail: 'No tiene descripción. Hay que escribirla.',
          ...ctx,
        });
      }

      // Check truncated text (ends with "..." or "…")
      if (pillar.explanation && (pillar.explanation.endsWith('...') || pillar.explanation.endsWith('…'))) {
        truncatedCount++;
        issues.push({
          candidate: c.name,
          pillar: pillarLabel,
          type: 'truncated_text',
          severity: 'warning',
          detail: `La descripción se cortó a la mitad (termina en "..."). Hay que completarla.`,
          ...ctx,
        });
      }

      // Check generic/template explanations (not candidate-specific)
      const allGeneric = [...GENERIC_LEGAL_TEXTS, ...GENERIC_PLAN_TEXTS];
      if (pillar.explanation && allGeneric.includes(pillar.explanation.trim())) {
        genericExplanations++;
        issues.push({
          candidate: c.name,
          pillar: pillarLabel,
          type: 'generic_explanation',
          severity: 'info',
          detail: `Dice "${pillar.explanation.slice(0, 50)}${pillar.explanation.length > 50 ? '…' : ''}" — es la misma frase para muchos candidatos. Hay que personalizarla.`,
          ...ctx,
        });
      }

      // Check for filtered sources (Resumen del plan PDFs that exist in data but are hidden on the web)
      if (pillarKey === 'plan') {
        const filtered = pillar.sources.filter((s) =>
          s.title.toLowerCase().includes('resumen del plan')
        );
        if (filtered.length > 0) {
          filteredSourcesCount += filtered.length;
          issues.push({
            candidate: c.name,
            pillar: pillarLabel,
            type: 'filtered_source',
            severity: 'warning',
            detail: `Tiene un link al PDF del plan de gobierno del JNE, pero no se muestra porque suele dar error al abrirlo.`,
            ...ctx,
          });
        }
      }

      // Check missing sources
      if (!pillar.sources || pillar.sources.length === 0) {
        issues.push({
          candidate: c.name,
          pillar: pillarLabel,
          type: 'missing_sources',
          severity: 'error',
          detail: 'No tiene ningún link de fuente. Hay que agregar al menos uno.',
          ...ctx,
        });
        continue;
      }

      // Check each source URL
      for (const source of pillar.sources) {
        totalSources++;
        try {
          const url = new URL(source.url);
          const domain = url.hostname;
          sourceDomainCount[domain] = (sourceDomainCount[domain] || 0) + 1;
          if (TRUSTED_DOMAINS.includes(domain)) {
            trustedSources++;
          } else {
            issues.push({
              candidate: c.name,
              pillar: pillarLabel,
              type: 'untrusted_source',
              severity: 'error',
              detail: `Tiene un link a "${domain}" que no es una fuente oficial. Solo usamos JNE, SUNEDU y Poder Judicial.`,
              ...ctx,
            });
          }
        } catch {
          issues.push({
            candidate: c.name,
            pillar: pillarLabel,
            type: 'invalid_url',
            severity: 'error',
            detail: `Tiene un link roto que no se puede abrir.`,
            ...ctx,
          });
        }
      }
    }
  }

  const healthScore = totalSources > 0 ? Math.round((trustedSources / totalSources) * 100) : 0;

  const domainBreakdown = Object.entries(sourceDomainCount)
    .map(([domain, count]) => ({
      domain,
      count,
      trusted: TRUSTED_DOMAINS.includes(domain),
    }))
    .sort((a, b) => b.count - a.count);

  // Count by severity
  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const infos = issues.filter((i) => i.severity === 'info').length;

  return NextResponse.json({
    healthScore,
    totalCandidates: candidates.length,
    totalSources,
    trustedSources,
    untrustedSources: totalSources - trustedSources,
    truncatedCount,
    filteredSourcesCount,
    genericExplanations,
    domainBreakdown,
    issues,
    issueSummary: { errors, warnings, infos },
    trustedDomains: TRUSTED_DOMAINS,
    checkedAt: new Date().toISOString(),
  });
}
