import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface ContextRequest {
  candidateName: string;
  candidateParty: string;
  pillar: 'education' | 'legal';
  currentExplanation: string;
}

const SYSTEM_PROMPT = `Eres un agregador de noticias públicas sobre candidatos presidenciales peruanos (elecciones 2026).

Tu trabajo: determinar si existe información pública NOTABLE que complemente lo que el candidato declaró ante el JNE sobre su educación o situación legal.

REGLAS:
- Solo menciona hechos bien documentados en medios peruanos o internacionales
- Si NO hay nada notable o controversial, responde exactamente: null
- Si hay algo, escribe 1 oración máximo en español
- Usa lenguaje factual: "Medios reportaron...", "En [año], se conoció que...", "Según reportes de prensa..."
- NO hagas juicios de valor ni afirmaciones de culpabilidad
- NO inventes información — si no estás seguro, responde null
- NO repitas lo que ya dice la explicación actual
- Para educación: menciona solo controversias sobre grados académicos (plagios, grados no reconocidos, investigaciones)
- Para legal: menciona solo casos judiciales de alto perfil, condenas, o investigaciones públicamente conocidas
- La mayoría de candidatos NO tienen contexto notable — responde null para ellos`;

const openai = new OpenAI();

export async function POST(request: NextRequest) {
  try {
    const body: ContextRequest = await request.json();
    const { candidateName, candidateParty, pillar, currentExplanation } = body;

    if (!candidateName || !pillar) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pillarLabel = pillar === 'education' ? 'educación' : 'situación legal';

    const userPrompt = `Candidato: ${candidateName}
Partido: ${candidateParty}
Pilar: ${pillarLabel}
Lo que declaró ante el JNE: ${currentExplanation}

¿Existe información pública notable que complemente esta declaración? Si no hay nada, responde null.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      max_tokens: 150,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? 'null';
    const context = raw.toLowerCase() === 'null' || raw === '' ? null : raw;

    return NextResponse.json({
      context,
      model: completion.model,
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
