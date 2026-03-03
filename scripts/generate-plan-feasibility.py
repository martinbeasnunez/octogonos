#!/usr/bin/env python3
"""
Evalúa la viabilidad de cada plan de gobierno usando OpenAI.

Criterios objetivos (sin sesgo político):
1. Especificidad: ¿Tiene metas concretas, cifras, plazos?
2. Viabilidad fiscal: ¿Es financiable con el presupuesto peruano?
3. Capacidad institucional: ¿Tiene Perú las instituciones para ejecutarlo?
4. Precedentes: ¿Hay evidencia de que políticas similares han funcionado?
5. Coherencia interna: ¿Las propuestas se contradicen entre sí?

Uso:
  OPENAI_API_KEY=sk-... python3 scripts/generate-plan-feasibility.py

Requiere: openai, poppler (pdftotext)
"""

import json
import os
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from openai import OpenAI
except ImportError:
    print("Instalando openai...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "openai"])
    from openai import OpenAI

API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    print("Error: OPENAI_API_KEY no está definida como variable de entorno.")
    print("Uso: OPENAI_API_KEY=sk-... python3 scripts/generate-plan-feasibility.py")
    sys.exit(1)

client = OpenAI(api_key=API_KEY)

SYSTEM_PROMPT = """Eres un analista de políticas públicas especializado en América Latina.
Tu trabajo es evaluar la VIABILIDAD de planes de gobierno de candidatos presidenciales de Perú (elecciones 2026).

IMPORTANTE: No evalúas si las propuestas son buenas o malas ideológicamente. Solo evalúas qué tan REALIZABLES son.

Criterios de evaluación (cada uno de 1 a 10):

1. ESPECIFICIDAD (1-10): ¿Tiene metas concretas con cifras, plazos y responsables? ¿O son promesas vagas?
   - 1-3: Solo intenciones genéricas ("mejorar la educación")
   - 4-6: Algunas metas concretas pero faltan detalles de implementación
   - 7-10: Metas específicas con cifras, plazos y mecanismos claros

2. VIABILIDAD FISCAL (1-10): ¿Es financiable considerando el presupuesto peruano (~S/ 240 mil millones/año, ~25% del PBI)?
   - 1-3: Requiere recursos muy por encima de lo disponible, sin fuente de financiamiento
   - 4-6: Costoso pero parcialmente financiable con reformas tributarias
   - 7-10: Realista dentro del marco fiscal existente o con fuentes claras

3. CAPACIDAD INSTITUCIONAL (1-10): ¿Tiene Perú las instituciones, personal y capacidad técnica para ejecutar estas propuestas en un período de 5 años?
   - 1-3: Requiere crear instituciones desde cero o transformaciones radicales
   - 4-6: Requiere reformas significativas pero factibles
   - 7-10: Se puede implementar con las instituciones existentes o mejoras incrementales

4. PRECEDENTES (1-10): ¿Hay evidencia internacional o nacional de que políticas similares han funcionado?
   - 1-3: Sin precedentes claros o con evidencia de fracaso
   - 4-6: Evidencia mixta o de contextos muy diferentes
   - 7-10: Evidencia sólida de éxito en contextos comparables

5. COHERENCIA (1-10): ¿Las propuestas son consistentes entre sí? ¿No se contradicen?
   - 1-3: Múltiples contradicciones graves
   - 4-6: Algunas tensiones pero manejables
   - 7-10: Propuestas bien articuladas y consistentes

Responde SIEMPRE en este formato JSON exacto (sin markdown, sin ```):
{
  "especificidad": <1-10>,
  "viabilidad_fiscal": <1-10>,
  "capacidad_institucional": <1-10>,
  "precedentes": <1-10>,
  "coherencia": <1-10>,
  "promedio": <promedio redondeado a 1 decimal>,
  "resumen": "<2-3 oraciones en español explicando los puntos fuertes y débiles del plan EN TÉRMINOS DE VIABILIDAD, no de ideología. Máximo 200 caracteres.>"
}"""

USER_PROMPT_TEMPLATE = """Evalúa la viabilidad del siguiente plan de gobierno (resumen oficial registrado ante el JNE).

Candidato: {name}
Partido: {party}

--- TEXTO DEL PLAN ---
{plan_text}
--- FIN DEL PLAN ---

Responde SOLO con el JSON de evaluación, sin texto adicional."""


def download_pdf_text(url):
    """Download PDF and extract text using pdftotext."""
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        subprocess.run(
            ["curl", "-sL", "-o", tmp_path, url],
            check=True,
            timeout=30,
        )
        result = subprocess.run(
            ["pdftotext", "-layout", tmp_path, "-"],
            capture_output=True,
            text=True,
            timeout=30,
        )
        return result.stdout.strip()
    except Exception as e:
        print(f"  Error extrayendo texto: {e}")
        return ""
    finally:
        os.unlink(tmp_path)


def evaluate_plan(name, party, plan_text):
    """Send plan text to OpenAI for feasibility evaluation."""
    # Truncate to ~12000 chars to stay within token limits
    if len(plan_text) > 12000:
        plan_text = plan_text[:12000] + "\n[...truncado...]"

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": USER_PROMPT_TEMPLATE.format(
                        name=name, party=party, plan_text=plan_text
                    ),
                },
            ],
            temperature=0.3,
            max_tokens=500,
        )
        content = response.choices[0].message.content.strip()
        # Clean potential markdown wrapping
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()
        return json.loads(content)
    except json.JSONDecodeError as e:
        print(f"  Error parseando JSON para {name}: {e}")
        print(f"  Respuesta: {content[:200]}")
        return None
    except Exception as e:
        print(f"  Error API para {name}: {e}")
        return None


def process_candidate(candidate):
    """Process a single candidate: download PDF + evaluate."""
    slug = candidate["slug"]
    name = candidate["name"]
    party = candidate["party"]
    plan = candidate.get("plan", {})

    url = plan.get("urlResumen") or plan.get("urlCompleto")
    if not url:
        print(f"  ⏭ {name}: sin PDF de plan")
        return slug, None

    print(f"  📄 {name}...")
    text = download_pdf_text(url)
    if not text or len(text) < 100:
        print(f"  ⚠ {name}: texto demasiado corto ({len(text)} chars)")
        return slug, None

    result = evaluate_plan(name, party, text)
    if result:
        print(f"  ✅ {name}: promedio {result.get('promedio', '?')}/10")
    return slug, result


def main():
    with open("scripts/candidates-raw.json", "r", encoding="utf-8") as f:
        raw = json.load(f)

    print(f"Evaluando viabilidad de {len(raw)} candidatos...\n")

    # Load existing results to avoid re-processing
    output_path = "scripts/plan-feasibility.json"
    existing = {}
    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
        print(f"  {len(existing)} evaluaciones previas encontradas\n")

    results = dict(existing)

    # Filter candidates that need processing
    to_process = [c for c in raw if c["slug"] not in existing and c.get("plan", {}).get("urlResumen")]

    if not to_process:
        print("Todas las evaluaciones ya están completas.")
        return

    print(f"  Procesando {len(to_process)} candidatos pendientes...\n")

    # Process sequentially to respect rate limits
    for candidate in to_process:
        slug, result = process_candidate(candidate)
        if result:
            results[slug] = result

        # Save incrementally
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

        time.sleep(0.5)  # Rate limit buffer

    print(f"\n✅ {len(results)} evaluaciones guardadas en {output_path}")

    # Summary stats
    if results:
        promedios = [r["promedio"] for r in results.values() if "promedio" in r]
        if promedios:
            avg = sum(promedios) / len(promedios)
            print(f"   Promedio general: {avg:.1f}/10")
            print(f"   Más viable: {max(promedios)}/10")
            print(f"   Menos viable: {min(promedios)}/10")


if __name__ == "__main__":
    main()
