import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface ContextRequest {
  candidateName: string;
  candidateParty: string;
  pillar: 'education' | 'legal';
  currentExplanation: string;
}

const openai = new OpenAI();

/**
 * Two-step process:
 * 1) GPT with web_search finds a REAL article about the candidate
 * 2) We extract the context, source name, and verified URL
 *
 * Uses OpenAI Responses API with web_search_preview tool so GPT
 * actually searches the internet and returns real URLs.
 */
export async function POST(request: NextRequest) {
  try {
    const body: ContextRequest = await request.json();
    const { candidateName, candidateParty, pillar, currentExplanation } = body;

    if (!candidateName || !pillar) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pillarLabel = pillar === 'education' ? 'educación' : 'situación legal';
    const searchFocus = pillar === 'education'
      ? 'controversias académicas, plagios de tesis, grados cuestionados, investigaciones sobre títulos'
      : 'casos judiciales, condenas, investigaciones fiscales, procesos penales';

    const prompt = `Busca en la web si existe información pública NOTABLE sobre la ${pillarLabel} del candidato presidencial peruano ${candidateName} (partido: ${candidateParty}).

Enfócate en: ${searchFocus}.

Lo que el candidato declaró ante el JNE: "${currentExplanation}"

INSTRUCCIONES:
- Busca en medios peruanos reconocidos: El Comercio, RPP, La República, Gestión, BBC Mundo, Reuters, etc.
- Si encuentras algo notable, responde SOLO con este JSON (sin markdown, sin backticks):
  {"context":"1 oración factual en español","source":"nombre del medio","sourceUrl":"URL REAL del artículo"}
- Si NO hay nada notable o no encuentras artículos reales, responde SOLO:
  {"context":null}
- Usa lenguaje factual: "Según [medio]...", "En [año], [medio] reportó que..."
- NO hagas juicios de valor ni afirmaciones de culpabilidad
- NO repitas lo que ya dice la declaración ante el JNE
- La mayoría de candidatos NO tienen contexto notable — responde {"context":null} para ellos
- IMPORTANTE: La URL debe ser de un artículo REAL que encontraste en tu búsqueda web`;

    // Use Responses API with web_search_preview for real URLs
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      tools: [{ type: 'web_search_preview' as const }],
      input: prompt,
    });

    const raw = response.output_text?.trim() ?? '{"context":null}';

    // Clean response — remove markdown code blocks if any
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let parsed: { context: string | null; source?: string; sourceUrl?: string | null };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          parsed = { context: null };
        }
      } else {
        parsed = { context: null };
      }
    }

    // Reject context without source — sin fuente no sirve
    if (parsed.context && !parsed.source) {
      parsed = { context: null };
    }

    // Reject sourceUrl that looks fake (literally "null" string or empty)
    if (parsed.sourceUrl === 'null' || parsed.sourceUrl === '') {
      parsed.sourceUrl = null;
    }

    return NextResponse.json({
      context: parsed.context ?? null,
      source: parsed.source ?? null,
      sourceUrl: parsed.sourceUrl ?? null,
      model: 'gpt-4o-mini-web-search',
      candidateName,
      pillar,
    });
  } catch (error) {
    console.error('AI context error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
