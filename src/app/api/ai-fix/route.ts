import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface AiFixRequest {
  candidateName: string;
  candidateParty: string;
  pillar: 'education' | 'legal' | 'plan';
  pillarLabel: string;
  issueType: 'truncated_text' | 'generic_explanation' | 'empty_explanation';
  currentText: string;
  score: string;
  sourceUrls: string[];
  sourceTitles: string[];
}

const SYSTEM_PROMPT = `Eres un editor de datos electorales para un sitio web peruano sobre candidatos presidenciales 2026.

Tu trabajo: escribir descripciones cortas y factuales para la ficha de cada candidato.

REGLAS CRÍTICAS:
1. NO repitas el nombre del candidato ni su partido. El usuario ya está viendo su ficha — sería redundante. Ve directo a la información.
2. Escribe SOLO el texto de reemplazo. Sin comillas, sin prefijos, sin explicaciones tuyas.
3. Máximo 2-3 oraciones cortas. Estilo periodístico neutral.
4. SOLO usa datos que puedas respaldar con las fuentes oficiales indicadas. NUNCA inventes datos.
5. Si no tienes info suficiente de las fuentes, di exactamente qué se verificó y qué resultado dio (ej: "No registra sentencias penales según el Poder Judicial" en vez de inventar un historial).
6. Escribe en español.

EJEMPLOS DE BUEN FORMATO:
- Educación: "Bachiller en Derecho — Universidad Nacional Mayor de San Marcos (concluido). Maestría en Gestión Pública — ESAN (en curso)."
- Legal: "No registra sentencias penales según el Poder Judicial. Declaró una anotación por proceso civil ante el JNE."
- Plan: "Propone reforma del sistema de pensiones y ampliación de Pensión 65. Incluye plan de infraestructura vial para zonas rurales."

EJEMPLOS DE MAL FORMATO (no hagas esto):
- "Rosario Fernández es candidata por Un Camino Diferente..." ← REDUNDANTE, ya se sabe
- "Según las fuentes consultadas, este candidato..." ← RELLENO, ve al grano
- "Es un político con amplia trayectoria..." ← VAGO, datos concretos`;

function buildUserPrompt(req: AiFixRequest): string {
  const sourcesText = req.sourceUrls
    .map((url, i) => `  - ${req.sourceTitles[i] || 'Fuente'}: ${url}`)
    .join('\n');

  const context = `Candidato: ${req.candidateName} (${req.candidateParty})
Pilar: ${req.pillarLabel}
Score: ${req.score}
Fuentes oficiales:
${sourcesText || '  (sin fuentes)'}`;

  switch (req.issueType) {
    case 'truncated_text':
      return `${context}

Texto actual (CORTADO, termina en "..."): "${req.currentText}"

Completa la oración de forma natural. Mantén todo lo que ya dice y termínala correctamente. NO repitas nombre ni partido.`;

    case 'generic_explanation':
      return `${context}

Texto actual (GENÉRICO, es igual para muchos candidatos): "${req.currentText}"

Reescribe con info específica de este candidato. Usa solo datos que se puedan verificar en las fuentes oficiales listadas. NO repitas nombre ni partido.`;

    case 'empty_explanation':
      return `${context}

No hay descripción. Escribe una basada en lo que se puede verificar en las fuentes oficiales. NO repitas nombre ni partido.`;

    default:
      return `${context}\n\nMejora este texto (sin repetir nombre ni partido): "${req.currentText}"`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key no configurada. Agrega OPENAI_API_KEY en las variables de entorno.' },
        { status: 503 }
      );
    }

    const body: AiFixRequest = await request.json();

    if (!body.candidateName || !body.pillar || !body.issueType) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: candidateName, pillar, issueType' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(body) },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim() || '';

    if (!suggestion) {
      return NextResponse.json(
        { error: 'La IA no generó una sugerencia' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      suggestion,
      model: completion.model,
    });
  } catch (err) {
    console.error('AI fix error:', err);
    const message = err instanceof Error ? err.message : 'Error generando sugerencia';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
