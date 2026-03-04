import { NextResponse } from 'next/server';
import { candidates } from '@/data/candidates';
import OpenAI from 'openai';

// ── Types ──────────────────────────────────────────────────────

interface FixResult {
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
}

// ── Prompt (same as /api/ai-fix) ───────────────────────────────

const SYSTEM_PROMPT = `Eres un editor de datos electorales para un sitio web peruano sobre candidatos presidenciales 2026.

Tu trabajo: escribir descripciones cortas y factuales para la ficha de cada candidato.

REGLAS CRÍTICAS:
1. NO repitas el nombre del candidato ni su partido. El usuario ya está viendo su ficha — sería redundante. Ve directo a la información.
2. Escribe SOLO el texto de reemplazo. Sin comillas, sin prefijos, sin explicaciones tuyas.
3. Máximo 2-3 oraciones cortas. Estilo periodístico neutral.
4. SOLO usa datos que puedas respaldar con las fuentes oficiales indicadas. NUNCA inventes datos.
5. SOLO usamos datos del JNE (Voto Informado) y SUNEDU. NUNCA afirmes que verificaste el Poder Judicial u otra fuente.
6. Escribe en español.

EJEMPLOS DE BUEN FORMATO:
- Educación: "Bachiller en Derecho — Universidad Nacional Mayor de San Marcos (concluido). Maestría en Gestión Pública — ESAN (en curso). Verificar grado en SUNEDU."
- Legal: "Declaró una anotación por proceso civil en su hoja de vida ante el JNE."
- Plan: "Propone reforma del sistema de pensiones y ampliación de Pensión 65. Incluye plan de infraestructura vial para zonas rurales."

EJEMPLOS DE MAL FORMATO (no hagas esto):
- "Rosario Fernández es candidata por Un Camino Diferente..." ← REDUNDANTE
- "Según las fuentes consultadas, este candidato..." ← RELLENO
- "Es un político con amplia trayectoria..." ← VAGO`;

// Known generic texts
const GENERIC_TEXTS = [
  'Tiene anotaciones en su declaración ante el JNE. Revisa la fuente.',
  'Sin alertas en su declaración ante el JNE.',
  'No se encontró plan de gobierno registrado ante el JNE.',
];

const pillarNames: Record<string, string> = {
  education: 'Educación',
  legal: 'Legal',
  plan: 'Plan de gob.',
};

// ── Main handler ───────────────────────────────────────────────

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key no configurada' },
      { status: 503 }
    );
  }

  const openai = new OpenAI({ apiKey });
  const fixes: FixResult[] = [];
  const errors: Array<{ candidate: string; pillar: string; error: string }> = [];

  // Collect all fixable issues
  interface Fixable {
    candidate: typeof candidates[0];
    pillarKey: 'education' | 'legal' | 'plan';
    issueType: 'truncated_text' | 'generic_explanation' | 'empty_explanation';
  }

  const fixables: Fixable[] = [];

  for (const c of candidates) {
    for (const pillarKey of ['education', 'legal', 'plan'] as const) {
      const pillar = c[pillarKey];
      const text = pillar.explanation || '';

      // Truncated
      if (text && (text.endsWith('...') || text.endsWith('…'))) {
        fixables.push({ candidate: c, pillarKey, issueType: 'truncated_text' });
      }
      // Generic
      else if (text && GENERIC_TEXTS.includes(text.trim())) {
        fixables.push({ candidate: c, pillarKey, issueType: 'generic_explanation' });
      }
      // Empty
      else if (!text || text.trim().length < 5) {
        fixables.push({ candidate: c, pillarKey, issueType: 'empty_explanation' });
      }
    }
  }

  // Process in batches of 5 (parallel within batch, sequential across batches)
  const BATCH_SIZE = 5;
  for (let i = 0; i < fixables.length; i += BATCH_SIZE) {
    const batch = fixables.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(async ({ candidate: c, pillarKey, issueType }) => {
        const pillar = c[pillarKey];
        const text = pillar.explanation || '';
        const label = pillarNames[pillarKey];
        const urls = pillar.sources?.map((s) => s.url) || [];
        const titles = pillar.sources?.map((s) => s.title) || [];

        const sourcesText = urls
          .map((url, si) => `  - ${titles[si] || 'Fuente'}: ${url}`)
          .join('\n');

        const context = `Candidato: ${c.name} (${c.party})\nPilar: ${label}\nScore: ${pillar.score}\nFuentes oficiales:\n${sourcesText || '  (sin fuentes)'}`;

        let prompt = '';
        switch (issueType) {
          case 'truncated_text':
            prompt = `${context}\n\nTexto actual (CORTADO): "${text}"\n\nCompleta la oración. Mantén lo que dice y termínala. NO repitas nombre ni partido.`;
            break;
          case 'generic_explanation':
            prompt = `${context}\n\nTexto actual (GENÉRICO): "${text}"\n\nReescribe con info específica verificable en las fuentes. NO repitas nombre ni partido.`;
            break;
          case 'empty_explanation':
            prompt = `${context}\n\nNo hay descripción. Escribe una basada en las fuentes. NO repitas nombre ni partido.`;
            break;
        }

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 500,
        });

        const suggestion = completion.choices[0]?.message?.content?.trim() || '';
        if (!suggestion) throw new Error('Empty response');

        return {
          candidateSlug: c.slug,
          candidateName: c.name,
          pillar: label,
          pillarKey,
          issueType,
          originalText: text,
          fixedText: suggestion,
          sourceUrls: urls,
          sourceTitles: titles,
          model: completion.model,
          fixedAt: new Date().toISOString(),
        } satisfies FixResult;
      })
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const item = batch[j];
      if (result.status === 'fulfilled') {
        fixes.push(result.value);
      } else {
        errors.push({
          candidate: item.candidate.name,
          pillar: pillarNames[item.pillarKey],
          error: result.reason?.message || 'Unknown error',
        });
      }
    }
  }

  return NextResponse.json({
    total: fixables.length,
    fixed: fixes.length,
    failed: errors.length,
    fixes,
    errors,
    completedAt: new Date().toISOString(),
  });
}
