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
  pillar: string;
  type: IssueType;
  severity: IssueSeverity;
  detail: string;
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

      // Check empty explanation
      if (!pillar.explanation || pillar.explanation.trim().length < 5) {
        issues.push({
          candidate: c.name,
          pillar: pillarLabel,
          type: 'empty_explanation',
          severity: 'error',
          detail: 'Explicación vacía o muy corta',
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
          detail: `Texto cortado: "…${pillar.explanation.slice(-60)}"`,
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
          detail: `Texto genérico (no específico del candidato): "${pillar.explanation.slice(0, 60)}"`,
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
            detail: `${filtered.length} fuente(s) oculta(s) en la web: "${filtered[0].title}"`,
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
          detail: 'Sin fuentes',
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
              detail: `Dominio no verificado: ${domain}`,
            });
          }
        } catch {
          issues.push({
            candidate: c.name,
            pillar: pillarLabel,
            type: 'invalid_url',
            severity: 'error',
            detail: `URL inválida: ${source.url}`,
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
