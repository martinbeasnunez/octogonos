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

Tu tarea es mejorar las descripciones de cada candidato que aparecen en su ficha.
Las descripciones son cortas (1-3 oraciones) y resumen información factual de fuentes oficiales del JNE (Jurado Nacional de Elecciones), SUNEDU y el Poder Judicial.

Reglas:
- Escribe SOLO el texto de reemplazo, sin explicaciones, sin comillas, sin prefijos.
- Mantén un tono neutral, periodístico y factual.
- No inventes datos. Si no tienes información suficiente, describe lo que sí se sabe según las fuentes.
- Usa el mismo estilo de los textos existentes: oraciones cortas, datos concretos.
- El texto debe ser específico para el candidato mencionado.
- Máximo 2-3 oraciones.
- Escribe en español.`;

function buildUserPrompt(req: AiFixRequest): string {
  const sourcesText = req.sourceUrls
    .map((url, i) => `  - ${req.sourceTitles[i] || 'Fuente'}: ${url}`)
    .join('\n');

  const base = `Candidato: ${req.candidateName} (${req.candidateParty})
Pilar: ${req.pillarLabel}
Score actual: ${req.score}
Fuentes disponibles:
${sourcesText || '  (sin fuentes)'}`;

  switch (req.issueType) {
    case 'truncated_text':
      return `${base}

Texto actual (CORTADO, termina en "..."): "${req.currentText}"

El texto está incompleto porque se cortó al extraer los datos automáticamente.
Completa el texto de forma natural, manteniendo toda la información existente y completando lo que falta para que la oración termine correctamente.`;

    case 'generic_explanation':
      return `${base}

Texto actual (GENÉRICO, se repite igual para muchos candidatos): "${req.currentText}"

Este texto es una plantilla que se usa igual para varios candidatos y no dice nada específico.
Escribe una descripción específica para ESTE candidato basándote en su nombre, partido y las fuentes indicadas.`;

    case 'empty_explanation':
      return `${base}

No hay descripción para este pilar. Escribe una descripción corta basada en las fuentes disponibles.`;

    default:
      return `${base}\n\nMejora este texto: "${req.currentText}"`;
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

    // Validate
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
