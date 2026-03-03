#!/usr/bin/env python3
"""
Transforma candidates-raw.json (del JNE) al formato TypeScript de candidates.ts.

Scoring:
- EDUCACIÓN: Doctorado/Maestría = Bajo (bien preparado), Universitaria = Medio, Técnica/Básica = Alto
  Nota: "Alto" = mayor alerta. En educación, mayor alerta = menor preparación.
- SITUACIÓN LEGAL: Sin sentencias ni anotaciones = Bajo, con anotaciones = Medio, con sentencias = Alto
- PLAN: Disponible + resumen + completo = Bajo, solo parcial = Medio, no disponible = Alto
"""

import json

JNE_BASE = "https://votoinformado.jne.gob.pe"


def score_education(edu):
    """Score education level. Alto = more alert (less education)."""
    level = edu.get("level", "")
    details = edu.get("details", [])

    if level in ("Doctorado", "Maestría"):
        score = "Bajo"
    elif level == "Universitaria":
        score = "Medio"
    else:
        score = "Alto"

    # Build explanation
    if details:
        explanation = ". ".join(d for d in details[:2])  # max 2 details
        if len(explanation) > 200:
            explanation = explanation[:197] + "..."
    else:
        explanation = f"Nivel declarado: {level}."

    return score, explanation


def score_legal(legal):
    """Score legal situation. Alto = more alert (more legal issues)."""
    sentencias = legal.get("sentencias", [])
    anotaciones = legal.get("anotaciones", [])

    if sentencias:
        score = "Alto"
        explanation = "Declaró sentencia(s) ante el JNE. Revisa la fuente."
    elif anotaciones:
        score = "Medio"
        explanation = "Tiene anotaciones en su declaración ante el JNE. Revisa la fuente."
    else:
        score = "Bajo"
        explanation = "Sin alertas en su declaración ante el JNE."

    return score, explanation


def load_plan_summaries():
    """Load AI-generated plan summaries from plan-summaries.json."""
    import os
    path = os.path.join(os.path.dirname(__file__), "plan-summaries.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


PLAN_SUMMARIES = load_plan_summaries()


def score_plan(plan, slug=""):
    """Score government plan. Alto = more alert (no plan or incomplete)."""
    if not plan.get("available"):
        return "Alto", "No se encontró plan de gobierno registrado en el JNE al momento de la consulta."

    has_resumen = bool(plan.get("urlResumen"))
    has_completo = bool(plan.get("urlCompleto"))

    if has_completo and has_resumen:
        score = "Bajo"
    elif has_completo or has_resumen:
        score = "Medio"
    else:
        score = "Medio"

    # Use AI summary if available, otherwise generic text
    summary = PLAN_SUMMARIES.get(slug, "")
    if summary:
        explanation = summary
    elif score == "Bajo":
        explanation = "Plan de gobierno completo y resumen disponibles en el JNE."
    elif has_completo or has_resumen:
        explanation = "Plan de gobierno parcialmente disponible en el JNE (falta resumen o documento completo)."
    else:
        explanation = "Plan de gobierno registrado pero sin documentos descargables al momento de la consulta."

    return score, explanation


def build_sources(candidate):
    """Build sources list for each pillar."""
    src = candidate["sources"]
    id_org = candidate["idOrganizacionPolitica"]

    edu_sources = [
        {"title": "Hoja de vida — JNE Voto Informado", "url": src["hojaVida"]},
        {"title": "Verificar grado — SUNEDU", "url": "https://enlinea.sunedu.gob.pe/"},
    ]
    legal_sources = [
        {"title": "Hoja de vida — JNE Voto Informado", "url": src["hojaVida"]},
        {"title": "Consulta de expedientes — Poder Judicial", "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"},
    ]
    plan_sources = [
        {"title": "Fórmula presidencial — JNE Voto Informado", "url": src["formulaPresidencial"]},
    ]

    plan = candidate.get("plan", {})
    if plan.get("urlCompleto"):
        plan_sources.append({"title": "Plan de gobierno completo (PDF)", "url": plan["urlCompleto"]})
    if plan.get("urlResumen"):
        plan_sources.append({"title": "Resumen del plan de gobierno (PDF)", "url": plan["urlResumen"]})

    return edu_sources, legal_sources, plan_sources


def main():
    with open("scripts/candidates-raw.json", "r", encoding="utf-8") as f:
        raw = json.load(f)

    candidates = []
    for c in raw:
        edu_score, edu_explanation = score_education(c["education"])
        legal_score, legal_explanation = score_legal(c["legal"])
        plan_score, plan_explanation = score_plan(c["plan"], slug=c["slug"])
        edu_sources, legal_sources, plan_sources = build_sources(c)

        candidates.append({
            "name": c["name"],
            "slug": c["slug"],
            "party": c["party"],
            "education": {
                "score": edu_score,
                "explanation": edu_explanation,
                "sources": edu_sources,
            },
            "legal": {
                "score": legal_score,
                "explanation": legal_explanation,
                "sources": legal_sources,
            },
            "plan": {
                "score": plan_score,
                "explanation": plan_explanation,
                "sources": plan_sources,
            },
        })

    # Generate TypeScript file
    ts_lines = []
    ts_lines.append('export type ScoreLevel = "Alto" | "Medio" | "Bajo";')
    ts_lines.append('export type PillarType = "education" | "legal" | "plan";')
    ts_lines.append('')
    ts_lines.append('const pillarDisplayLabels: Record<PillarType, Record<ScoreLevel, string>> = {')
    ts_lines.append('  education: { Bajo: "SÓLIDO", Medio: "MIXTO", Alto: "DÉBIL" },')
    ts_lines.append('  legal: { Bajo: "NEUTRO", Medio: "MIXTO", Alto: "ALERTA" },')
    ts_lines.append('  plan: { Bajo: "REAL", Medio: "MIXTO", Alto: "ETÉREO" },')
    ts_lines.append('};')
    ts_lines.append('')
    ts_lines.append('export function getDisplayLabel(pillar: PillarType, score: ScoreLevel): string {')
    ts_lines.append('  return pillarDisplayLabels[pillar][score];')
    ts_lines.append('}')
    ts_lines.append('')
    ts_lines.append('const scoreDescriptions: Record<PillarType, Record<ScoreLevel, string>> = {')
    ts_lines.append('  education: {')
    ts_lines.append('    Bajo: "Tiene posgrado (maestría o doctorado)",')
    ts_lines.append('    Medio: "Estudios universitarios completados",')
    ts_lines.append('    Alto: "Educación técnica o básica declarada",')
    ts_lines.append('  },')
    ts_lines.append('  legal: {')
    ts_lines.append('    Bajo: "Sin alertas en registros públicos",')
    ts_lines.append('    Medio: "Tiene anotaciones pendientes",')
    ts_lines.append('    Alto: "Declaró sentencia(s) ante el JNE",')
    ts_lines.append('  },')
    ts_lines.append('  plan: {')
    ts_lines.append('    Bajo: "Plan completo y resumen disponibles",')
    ts_lines.append('    Medio: "Plan parcialmente disponible",')
    ts_lines.append('    Alto: "Sin plan de gobierno registrado",')
    ts_lines.append('  },')
    ts_lines.append('};')
    ts_lines.append('')
    ts_lines.append('export function getScoreDescription(pillar: PillarType, score: ScoreLevel): string {')
    ts_lines.append('  return scoreDescriptions[pillar][score];')
    ts_lines.append('}')
    ts_lines.append('')
    ts_lines.append('export interface Source {')
    ts_lines.append('  title: string;')
    ts_lines.append('  url: string;')
    ts_lines.append('}')
    ts_lines.append('')
    ts_lines.append('export interface PillarScore {')
    ts_lines.append('  score: ScoreLevel;')
    ts_lines.append('  explanation: string;')
    ts_lines.append('  sources: Source[];')
    ts_lines.append('}')
    ts_lines.append('')
    ts_lines.append('export interface Candidate {')
    ts_lines.append('  name: string;')
    ts_lines.append('  slug: string;')
    ts_lines.append('  party: string;')
    ts_lines.append('  photo?: string;')
    ts_lines.append('  education: PillarScore;')
    ts_lines.append('  legal: PillarScore;')
    ts_lines.append('  plan: PillarScore;')
    ts_lines.append('}')
    ts_lines.append('')
    ts_lines.append('/**')
    ts_lines.append(' * Datos de candidatos presidenciales — Elecciones Generales 2026.')
    ts_lines.append(' * Fuente: JNE Voto Informado (https://votoinformado.jne.gob.pe)')
    ts_lines.append(' * Generado automáticamente por scripts/generate-candidates.py')
    ts_lines.append(f' * Total: {len(candidates)} candidatos')
    ts_lines.append(' *')
    ts_lines.append(' * Para actualizar: python3 scripts/scrape-jne.py && python3 scripts/generate-candidates.py')
    ts_lines.append(' */')
    ts_lines.append(f'export const candidates: Candidate[] = {json.dumps(candidates, ensure_ascii=False, indent=2)};')
    ts_lines.append('')
    ts_lines.append('export function getCandidateBySlug(slug: string): Candidate | undefined {')
    ts_lines.append('  return candidates.find((c) => c.slug === slug);')
    ts_lines.append('}')
    ts_lines.append('')
    ts_lines.append('export function searchCandidates(query: string): Candidate[] {')
    ts_lines.append('  const q = query.toLowerCase().trim();')
    ts_lines.append('  if (!q) return candidates;')
    ts_lines.append('  return candidates.filter(')
    ts_lines.append('    (c) =>')
    ts_lines.append('      c.name.toLowerCase().includes(q) ||')
    ts_lines.append('      c.party.toLowerCase().includes(q) ||')
    ts_lines.append('      c.slug.includes(q)')
    ts_lines.append('  );')
    ts_lines.append('}')

    output_path = "src/data/candidates.ts"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write('\n'.join(ts_lines) + '\n')

    print(f"Generado {output_path} con {len(candidates)} candidatos")

    # Summary
    print(f"\nResumen de scores:")
    for pillar in ["education", "legal", "plan"]:
        scores = {}
        for c in candidates:
            s = c[pillar]["score"]
            scores[s] = scores.get(s, 0) + 1
        print(f"  {pillar}: {scores}")


if __name__ == "__main__":
    main()
