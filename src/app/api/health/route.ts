import { candidates } from '@/data/candidates';
import { NextResponse } from 'next/server';

// Only these domains are trusted sources
const TRUSTED_DOMAINS = [
  'votoinformado.jne.gob.pe',
  'enlinea.sunedu.gob.pe',
  'cej.pj.gob.pe',
  'mpesije.jne.gob.pe',
];

interface Issue {
  candidate: string;
  pillar: string;
  type: 'untrusted_source' | 'missing_sources' | 'empty_explanation' | 'invalid_url';
  detail: string;
}

export async function GET() {
  const issues: Issue[] = [];
  const pillarNames = { education: 'Educación', legal: 'Legal', plan: 'Plan de gob.' };
  const sourceDomainCount: Record<string, number> = {};
  let totalSources = 0;
  let trustedSources = 0;

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
          detail: 'Explicación vacía o muy corta',
        });
      }

      // Check missing sources
      if (!pillar.sources || pillar.sources.length === 0) {
        issues.push({
          candidate: c.name,
          pillar: pillarLabel,
          type: 'missing_sources',
          detail: 'Sin fuentes',
        });
        continue;
      }

      // Check each source
      for (const source of pillar.sources) {
        totalSources++;

        try {
          const url = new URL(source.url);
          const domain = url.hostname;

          // Count domain usage
          sourceDomainCount[domain] = (sourceDomainCount[domain] || 0) + 1;

          if (TRUSTED_DOMAINS.includes(domain)) {
            trustedSources++;
          } else {
            issues.push({
              candidate: c.name,
              pillar: pillarLabel,
              type: 'untrusted_source',
              detail: `Dominio no verificado: ${domain} (${source.url})`,
            });
          }
        } catch {
          issues.push({
            candidate: c.name,
            pillar: pillarLabel,
            type: 'invalid_url',
            detail: `URL inválida: ${source.url}`,
          });
        }
      }
    }
  }

  const healthScore = totalSources > 0 ? Math.round((trustedSources / totalSources) * 100) : 0;

  // Sort domains by count descending
  const domainBreakdown = Object.entries(sourceDomainCount)
    .map(([domain, count]) => ({
      domain,
      count,
      trusted: TRUSTED_DOMAINS.includes(domain),
    }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({
    healthScore,
    totalCandidates: candidates.length,
    totalSources,
    trustedSources,
    untrustedSources: totalSources - trustedSources,
    domainBreakdown,
    issues,
    trustedDomains: TRUSTED_DOMAINS,
    checkedAt: new Date().toISOString(),
  });
}
