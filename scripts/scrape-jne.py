#!/usr/bin/env python3
"""
Script para extraer datos de candidatos presidenciales desde la API pública del JNE.
Fuente: https://votoinformado.jne.gob.pe

Genera el archivo scripts/candidates-raw.json con datos estructurados.
"""

import json
import time
import unicodedata
import urllib.request
import sys

BASE = "https://web.jne.gob.pe/serviciovotoinformado"
PROCESO_ELECTORAL = 124  # Elecciones Generales 2026
JNE_BASE = "https://votoinformado.jne.gob.pe"


def api_post(endpoint, body):
    url = f"{BASE}{endpoint}"
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f"  ERROR POST {url}: {e}", file=sys.stderr)
        return None


def api_get(endpoint):
    url = f"{BASE}{endpoint}"
    req = urllib.request.Request(url, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f"  ERROR GET {url}: {e}", file=sys.stderr)
        return None


def title_case(s):
    if not s:
        return ""
    words = s.strip().split()
    small = {"de", "del", "la", "las", "los", "y", "e", "en", "el", "al", "por"}
    result = []
    for i, w in enumerate(words):
        if w == "-":
            result.append("-")
        elif "-" in w:
            result.append("-".join(part.capitalize() for part in w.split("-")))
        elif i > 0 and w.lower() in small:
            result.append(w.lower())
        else:
            result.append(w.capitalize())
    return " ".join(result)


def make_slug(name):
    s = unicodedata.normalize("NFD", name.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace(" ", "-")
    s = "".join(c for c in s if c.isalnum() or c == "-")
    s = "-".join(part for part in s.split("-") if part)
    return s


def extract_education(data):
    """Extract education from HVConsolidado response."""
    if not data:
        return {"level": "No disponible", "details": []}

    details = []
    highest = "Educación básica"

    # Postgrado
    postgrados = data.get("lEduPosgrado") or []
    for pg in postgrados:
        centro = title_case(pg.get("strCenEstudioPosgrado", ""))
        esp = title_case(pg.get("strEspecialidadPosgrado", ""))
        es_maestro = pg.get("strEsMaestro", "") == "1"
        es_doctor = pg.get("strEsDoctor", "") == "1"
        concluido = pg.get("strConcluidoPosgrado", "") == "1"
        grado = "Doctorado" if es_doctor else "Maestría" if es_maestro else "Postgrado"
        detail = f"{grado}: {esp}" if esp else grado
        if centro:
            detail += f" — {centro}"
        if concluido:
            detail += " (Concluido)"
        details.append(detail)
    if postgrados:
        has_doctor = any(pg.get("strEsDoctor") == "1" for pg in postgrados)
        highest = "Doctorado" if has_doctor else "Maestría"

    # Universitaria
    universidades = data.get("lEduUniversitaria") or []
    for uni in universidades:
        centro = title_case(uni.get("strUniversidad", ""))
        carrera = title_case(uni.get("strCarreraUni", ""))
        titulo = uni.get("strTituloUni", "") == "1"
        bachiller = uni.get("strBachillerEduUni", "") == "1"
        concluido = uni.get("strConcluidoEduUni", "") == "1"
        status = "Titulado" if titulo else "Bachiller" if bachiller else "Concluido" if concluido else "No concluido"
        detail = carrera if carrera else "Estudios universitarios"
        if centro:
            detail += f" — {centro}"
        detail += f" ({status})"
        details.append(detail)
    if universidades and highest == "Educación básica":
        highest = "Universitaria"

    # Técnica
    tecnico = data.get("oEduTecnico")
    if tecnico and tecnico.get("strTengoEduTecnico") == "1":
        centro = title_case(tecnico.get("strCenEstudioTecnico", ""))
        carrera = title_case(tecnico.get("strCarreraTecnico", ""))
        detail = carrera or "Estudios técnicos"
        if centro:
            detail += f" — {centro}"
        details.append(detail)
        if highest == "Educación básica":
            highest = "Técnica"

    # No universitaria
    no_uni = data.get("oEduNoUniversitaria")
    if no_uni and no_uni.get("strTengoNoUniversitaria") == "1":
        centro = title_case(no_uni.get("strCenEstudioNoUni", ""))
        carrera = title_case(no_uni.get("strCarreraNoUni", ""))
        detail = carrera or "Estudios no universitarios"
        if centro:
            detail += f" — {centro}"
        details.append(detail)
        if highest == "Educación básica":
            highest = "No universitaria"

    # Básica
    basica = data.get("oEduBasica")
    if basica:
        primaria = basica.get("strEduPrimaria") == "1"
        secundaria = basica.get("strEduSecundaria") == "1"
        if not details:
            if secundaria:
                details.append("Secundaria completa" if basica.get("strConcluidoEduSecundaria") == "1" else "Secundaria")
            if primaria:
                details.append("Primaria completa" if basica.get("strConcluidoEduPrimaria") == "1" else "Primaria")

    return {"level": highest, "details": details}


def extract_legal(data):
    """Extract legal info from HVConsolidado response."""
    if not data:
        return {"sentencias": [], "procesos": []}

    sentencias = []
    for s in (data.get("lSentenciaPenal") or []):
        sentencias.append({
            "expediente": s.get("strExpedientePenal", ""),
            "delito": title_case(s.get("strDelitoPenal", "")),
            "fallo": title_case(s.get("strFalloPenal", "")),
            "modalidad": s.get("strModalidadPenal", ""),
            "cumplimiento": s.get("strCumplimientoPenal", ""),
        })

    # Anotaciones marginales (from JNE registry)
    anotaciones = []
    for a in (data.get("lAnotacionMarginal") or []):
        anotaciones.append({
            "tipo": a.get("strTipoAnotacion", ""),
            "descripcion": a.get("strDescripcion", ""),
        })

    return {"sentencias": sentencias, "anotaciones": anotaciones}


def get_plan_gobierno(id_org):
    """Get plan de gobierno info."""
    resp = api_post("/api/votoinf/plangobierno", {
        "pageSize": 10,
        "skip": 1,
        "filter": {
            "idProcesoElectoral": PROCESO_ELECTORAL,
            "idTipoEleccion": "1",
            "idOrganizacionPolitica": str(id_org),
            "txDatoCandidato": "",
            "idJuradoElectoral": "0",
        }
    })
    if not resp or not resp.get("data"):
        return None
    plans = resp["data"]
    if isinstance(plans, list) and plans:
        return plans[0]
    return plans


def main():
    print("Obteniendo candidatos presidenciales desde JNE...")
    resp = api_post("/api/votoinf/listarCanditatos", {
        "idProcesoElectoral": PROCESO_ELECTORAL,
        "strUbiDepartamento": "",
        "idTipoEleccion": 1,
    })
    if not resp or not resp.get("success"):
        print("ERROR: No se pudo obtener la lista de candidatos", file=sys.stderr)
        sys.exit(1)

    raw = resp["data"]
    presidents = [
        c for c in raw
        if c.get("idCargo") == 1
        and c.get("strEstadoCandidato") not in ("IMPROCEDENTE", "RENUNCIA")
    ]
    print(f"Candidatos presidenciales activos: {len(presidents)}")

    results = []

    for i, c in enumerate(presidents):
        name = title_case(f"{c['strNombres']} {c['strApellidoPaterno']} {c['strApellidoMaterno']}")
        party = title_case(c["strOrganizacionPolitica"])
        dni = c["strDocumentoIdentidad"]
        id_org = c["idOrganizacionPolitica"]

        print(f"\n[{i+1}/{len(presidents)}] {name} — {party}")

        # HV Consolidado (idOrganizacionPolitica must be string!)
        print("  Obteniendo hoja de vida...")
        hv_resp = api_post("/api/votoinf/HVConsolidado", {
            "idProcesoElectoral": PROCESO_ELECTORAL,
            "strDocumentoIdentidad": dni,
            "idOrganizacionPolitica": str(id_org),
        })
        hv_data = hv_resp.get("data") if hv_resp else None
        time.sleep(0.3)

        # Plan de gobierno
        print("  Obteniendo plan de gobierno...")
        plan = get_plan_gobierno(id_org)
        time.sleep(0.3)

        # Extract
        education = extract_education(hv_data)
        legal = extract_legal(hv_data)
        id_hoja_vida = hv_data.get("oDatosPersonales", {}).get("idHojaVida") if hv_data else None

        candidate = {
            "name": name,
            "slug": make_slug(name),
            "party": party,
            "dni": dni,
            "idOrganizacionPolitica": id_org,
            "idHojaVida": id_hoja_vida,
            "education": education,
            "legal": legal,
            "plan": {
                "available": plan is not None,
                "idPlanGobierno": plan.get("idPlanGobierno") if plan else None,
                "urlResumen": plan.get("txRutaResumen") if plan else None,
                "urlCompleto": plan.get("txRutaCompleto") if plan else None,
            },
            "sources": {
                "hojaVida": f"{JNE_BASE}/hoja-vida/{id_org}/{dni}",
                "formulaPresidencial": f"{JNE_BASE}/formula-presidencial/{id_org}",
            }
        }
        results.append(candidate)

        n_sent = len(legal["sentencias"])
        n_anot = len(legal["anotaciones"])
        print(f"  Educación: {education['level']} | Sentencias: {n_sent} | Anotaciones: {n_anot} | Plan: {'Sí' if plan else 'No'}")

    # Write output
    output = "scripts/candidates-raw.json"
    with open(output, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n{'='*60}")
    print(f"Escribidos {len(results)} candidatos en {output}")


if __name__ == "__main__":
    main()
