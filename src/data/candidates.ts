export type ScoreLevel = "Alto" | "Medio" | "Bajo";
export type PillarType = "education" | "legal" | "plan";

const pillarDisplayLabels: Record<PillarType, Record<ScoreLevel, string>> = {
  education: { Bajo: "SÓLIDO", Medio: "MIXTO", Alto: "DÉBIL" },
  legal: { Bajo: "NEUTRO", Medio: "MIXTO", Alto: "ALERTA" },
  plan: { Bajo: "REAL", Medio: "MIXTO", Alto: "ETÉREO" },
};

export function getDisplayLabel(pillar: PillarType, score: ScoreLevel): string {
  return pillarDisplayLabels[pillar][score];
}

const scoreDescriptions: Record<PillarType, Record<ScoreLevel, string>> = {
  education: {
    Bajo: "Tiene posgrado (maestría o doctorado)",
    Medio: "Estudios universitarios completados",
    Alto: "Educación técnica o básica declarada",
  },
  legal: {
    Bajo: "Sin alertas en registros públicos",
    Medio: "Tiene anotaciones pendientes",
    Alto: "Declaró sentencia(s) ante el JNE",
  },
  plan: {
    Bajo: "Plan completo y resumen disponibles",
    Medio: "Plan parcialmente disponible",
    Alto: "Sin plan de gobierno registrado",
  },
};

export function getScoreDescription(pillar: PillarType, score: ScoreLevel): string {
  return scoreDescriptions[pillar][score];
}

/** Semáforo: green=bueno, yellow=mixto, orange=neutro, red=malo */
export function getBadgeColor(pillar: PillarType, score: ScoreLevel): string {
  const label = getDisplayLabel(pillar, score);
  switch (label) {
    case "SÓLIDO":
    case "REAL":
      return "bg-score-bajo/10 text-score-bajo";
    case "MIXTO":
      return "bg-voraz-gold/10 text-voraz-gold";
    case "NEUTRO":
      return "bg-score-neutro/10 text-score-neutro";
    default: // DÉBIL, ALERTA, ETÉREO
      return "bg-voraz-red/10 text-voraz-red";
  }
}

export interface Source {
  title: string;
  url: string;
}

export interface PillarScore {
  score: ScoreLevel;
  explanation: string;
  sources: Source[];
}

export interface FeasibilityScore {
  especificidad: number;
  viabilidadFiscal: number;
  capacidadInstitucional: number;
  precedentes: number;
  coherencia: number;
  promedio: number;
  resumen: string;
}

export interface Candidate {
  name: string;
  slug: string;
  party: string;
  photo?: string;
  education: PillarScore;
  legal: PillarScore;
  plan: PillarScore;
}

/**
 * Datos de candidatos presidenciales — Elecciones Generales 2026.
 * Fuente: JNE Voto Informado (https://votoinformado.jne.gob.pe)
 * Generado automáticamente por scripts/generate-candidates.py
 * Total: 36 candidatos
 *
 * Para actualizar: python3 scripts/scrape-jne.py && python3 scripts/generate-candidates.py
 */
export const candidates: Candidate[] = [
  {
    "name": "Rosario del Pilar Fernandez Bazan",
    "slug": "rosario-del-pilar-fernandez-bazan",
    "party": "Un Camino Diferente",
    "education": {
      "score": "Medio",
      "explanation": "Bachiller en Educacion — Universidad Privada César Vallejo (Concluido). Educación Inicial — Instituto Pedagógico Indoamérica",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2998/18141156"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2998/18141156"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone combatir la inseguridad con tecnología y fuerzas armadas, ampliar cobertura de salud al 90%, modernizar la educación para generar empleo y reducir la corrupción.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2998"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/de662f06-21d5-4523-a3ec-4fcbacabe16c.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/8334f8be-c20c-4910-b1e3-fcf1a35f8197.pdf"
        }
      ]
    }
  },
  {
    "name": "George Patrick Forsyth Sommer",
    "slug": "george-patrick-forsyth-sommer",
    "party": "Partido Democratico Somos Peru",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Magíster en Administración — Universidad del Pacífico (Concluido). Bachiller en Administración de Empresas — Universidad Peruana de Ciencias Aplicadas S.a.c. (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/14/41265978"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/14/41265978"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone combatir crimen organizado y extorsiones, reducir inseguridad, fortalecer salud y reducir anemia, industrializar el país y duplicar agroexportaciones.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/14"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/1334ac30-c28e-42a5-8fc5-79a4638ccd2a.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/c1e6b2ab-a51c-4881-9365-033ec7b23577.pdf"
        }
      ]
    }
  },
  {
    "name": "Roberto Helbert Sanchez Palomino",
    "slug": "roberto-helbert-sanchez-palomino",
    "party": "Juntos por el Peru",
    "education": {
      "score": "Bajo",
      "explanation": "Postgrado: Maestria de Politicas Socilaes — Pontificia Universidad Catolica del Perú - Pucp (Concluido). Psicologo — Universidad Nacional Mayor de San Marcos (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/1264/16002918"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/1264/16002918"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Prioriza un sistema de salud público universal, nueva Constitución vía Asamblea Constituyente, educación pública gratuita, reforma policial y lucha contra el crimen organizado.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/1264"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/3dd0e649-061c-4f31-8c3f-7a0836b58bde.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/ec164ae5-0cc4-4a12-ac5e-762af886cc9a.pdf"
        }
      ]
    }
  },
  {
    "name": "Pitter Enrique Valderrama Peña",
    "slug": "pitter-enrique-valderrama-pena",
    "party": "Partido Aprista Peruano",
    "education": {
      "score": "Bajo",
      "explanation": "Postgrado: Maestría — Universidad de la Rioja. Bachiller en Derecho — Universidad de San Martín de Porres (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2930/43632186"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2930/43632186"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Busca reducir la violencia familiar, mejorar la educación, reorganizar el territorio en menos regiones, modernizar las Fuerzas Armadas y reactivar la economía.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2930"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/4d581919-b090-43d4-89e4-e284fde587b7.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/ed45f5ef-bec7-427c-b998-f4d5abec0d48.pdf"
        }
      ]
    }
  },
  {
    "name": "Alvaro Gonzalo Paz de la Barra Freigeiro",
    "slug": "alvaro-gonzalo-paz-de-la-barra-freigeiro",
    "party": "Fe en el Peru",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Magister en Gestión Pública — Eucim Business School (Concluido). Postgrado: Maestria en Derecho Constitucional y Derechos Humanos — Universidad Nacional Mayor de San Marcos",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2898/41904418"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2898/41904418"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone mejorar salud y educación con cobertura universal, combatir la corrupción, reducir informalidad laboral al 55% de empleo formal y proteger ecosistemas.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2898"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/b4869a0b-ff3d-47d7-af7b-62fd1295db83.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/f470547e-6200-48b8-8035-7cc227135a93.pdf"
        }
      ]
    }
  },
  {
    "name": "Ricardo Pablo Belmont Cassinelli",
    "slug": "ricardo-pablo-belmont-cassinelli",
    "party": "Partido Civico Obras",
    "education": {
      "score": "Medio",
      "explanation": "Bachiyer Administrador de Empresas — Universidad de Lima (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2941/09177250"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2941/09177250"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Plantea salud rural, reestructurar el sistema de justicia, reducir pobreza con microcréditos, terminar obras paralizadas y que comunidades sean dueñas del subsuelo minero.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2941"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/5643db28-6dbd-4d35-b79e-30d20d3bed85.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/79008239-1adf-42aa-ae86-7d604e36d2b8.pdf"
        }
      ]
    }
  },
  {
    "name": "Ronald Darwin Atencio Sotomayor",
    "slug": "ronald-darwin-atencio-sotomayor",
    "party": "Alianza Electoral Venceremos",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Maestro en Derecho Penal — Pontificia Universidad Católica del Perú (Concluido). Abogado — Universidad de San Martín de Porres (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/3025/41373494"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/3025/41373494"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone salud como derecho constitucional con sistema público gratuito, nueva Constitución vía referéndum, reactivar la industria y pymes, y frenar la deforestación amazónica.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/3025"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/9984addc-e998-43b1-920f-1178d4d973aa.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/d96622ee-a711-4a27-8fb3-639fa8023be7.pdf"
        }
      ]
    }
  },
  {
    "name": "Rafael Bernardo Lopez Aliaga Cazorla",
    "slug": "rafael-bernardo-lopez-aliaga-cazorla",
    "party": "Renovacion Popular",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Magister en Administracion — Universidad del Pacífico (Concluido). Ingeniero Industrial — Universidad de Piura (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/22/07845838"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/22/07845838"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone mano dura contra la delincuencia, eliminar la corrupción con cadena perpetua, reducir ministerios, privatizar empresas del Estado y crear hospitales de solidaridad.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/22"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/2096b44a-f3b6-4c81-b03d-94fbfc9ac762.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/5a861148-6867-430a-9308-6eadf2868ed1.pdf"
        }
      ]
    }
  },
  {
    "name": "Cesar Acuña Peralta",
    "slug": "cesar-acuna-peralta",
    "party": "Alianza Para el Progreso",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Maestro en Administracion de la Educacion — Universidad de Lima (Concluido). Maestría: Diploma de Magister en Dirección Universitaria — Universidad de los Andes (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/1257/17903382"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/1257/17903382"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone construir 1.25 millones de viviendas, reducir ministerios de 19 a 10, combatir extorsiones con inteligencia y atraer US$80 mil millones en inversión privada.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/1257"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/72576403-804a-4f28-85d3-bf4c7e648667.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/707fd179-701a-43e6-b814-71d8b9301852.pdf"
        }
      ]
    }
  },
  {
    "name": "Keiko Sofia Fujimori Higuchi",
    "slug": "keiko-sofia-fujimori-higuchi",
    "party": "Fuerza Popular",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Título de Máster en Administración de Empresas (grado de Maestro) — Columbia University (Concluido). Grado de Licenciada en Administración de Empresas (grado de Bachiller y Título Profesi...",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/1366/10001088"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Medio",
      "explanation": "Tiene anotaciones en su declaración ante el JNE. Revisa la fuente.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/1366/10001088"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone combatir la inseguridad con videovigilancia nacional, ampliar salud con telemedicina, construir 6 líneas de metro y dar vivienda a familias vulnerables.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/1366"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/da4b943d-4344-4743-9362-a11ccf3054cb.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/54765cdc-b494-409a-a30c-9e6bb2833566.pdf"
        }
      ]
    }
  },
  {
    "name": "Napoleon Becerra Garcia",
    "slug": "napoleon-becerra-garcia",
    "party": "Partido de los Trabajadores y Emprendedores Pte - Peru",
    "education": {
      "score": "Medio",
      "explanation": "Licenciado en Administracion — Universidad Inca Garcilaso de la Vega Asociación Civil (Concluido). Bachiller en Ciencias Administrativas — Universidad Inca Garcilaso de la Vega Asociación Civil (Co...",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2939/08058852"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2939/08058852"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Plantea erradicar pobreza, nueva Constitución, educación y salud gratuitas, reforma tributaria, banco para pequeños productores y lucha contra la corrupción.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2939"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/6988c030-5c2b-40d8-b656-dc48899d4d8c.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/51124bb5-022b-487d-9afc-78211fe2113d.pdf"
        }
      ]
    }
  },
  {
    "name": "Alfonso Carlos Espa y Garces-Alvear",
    "slug": "alfonso-carlos-espa-y-garces-alvear",
    "party": "Partido Sicreo",
    "education": {
      "score": "Medio",
      "explanation": "Bachiller en Derecho — Pontificia Universidad Católica del Perú (Concluido). Abogado — Pontificia Universidad Católica del Perú (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2935/10266270"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2935/10266270"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone combatir inseguridad con prevención, eliminar anemia infantil, bono educativo para elegir escuela, generar 5 millones de empleos y combatir minería ilegal.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2935"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/e9d731a4-a79f-42e0-9ff7-29f6abe2bd3f.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/158f6b39-7a03-405f-b152-6a5a0af4f395.pdf"
        }
      ]
    }
  },
  {
    "name": "Francisco Ernesto Diez-Canseco Távara",
    "slug": "francisco-ernesto-diez-canseco-tavara",
    "party": "Partido Politico Peru Accion",
    "education": {
      "score": "Medio",
      "explanation": "Abogado — Universidad Nacional Mayor de San Marcos (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2932/08263758"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2932/08263758"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Plantea mano dura contra la delincuencia con pena de muerte, fusionar MINSA-EsSalud, reducir ministerios a 10, bajar el IGV, formalizar pymes y completar proyectos de irrigación.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2932"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/f4e5c2c2-b0df-4033-adda-6617af774154.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/04492ff5-792a-43c1-a952-05cc305c79b4.pdf"
        }
      ]
    }
  },
  {
    "name": "Mario Enrique Vizcarra Cornejo",
    "slug": "mario-enrique-vizcarra-cornejo",
    "party": "Partido Politico Peru Primero",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Magister en Administracion — Universidad Esan (Concluido). Ingenieria Industrial — Universidad Nacional de Ingenieria (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2925/04411300"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Alto",
      "explanation": "Declaró sentencia(s) ante el JNE. Revisa la fuente.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2925/04411300"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone reducir anemia infantil, dar alimentación a familias en pobreza extrema, salud universal con más médicos y telemedicina, y educación con tecnología e IA.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2925"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/f9624874-7cf6-4737-8db3-b73707c98e70.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/db264271-bd78-4c78-af6c-c1fd64a2d6f5.pdf"
        }
      ]
    }
  },
  {
    "name": "Carlos Ernesto Jaico Carranza",
    "slug": "carlos-ernesto-jaico-carranza",
    "party": "Peru Moderno",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Grado de Licenciado en Derecho (máster en Derecho) (grado de Maestro) — University Of Fribourg (Concluido). Abogado — Universidad de San Martín de Porres (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2924/06529088"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2924/06529088"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone combatir la violencia de género, reducir la anemia infantil, digitalizar el Estado contra la corrupción, reducir la informalidad laboral y construir un tren transandino.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2924"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/12de1a7b-008b-43c5-9159-c62c9b45eab1.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/c27a6054-ece1-4c00-a3d0-ad3c23b0b9bb.pdf"
        }
      ]
    }
  },
  {
    "name": "Jose Leon Luna Galvez",
    "slug": "jose-leon-luna-galvez",
    "party": "Podemos Peru",
    "education": {
      "score": "Bajo",
      "explanation": "Doctorado: Doctor en Educacion — Universidad de San Martín de Porres (Concluido). Maestría: Maestro en Economia Mencion en Comercio y Finanzas Internacionales — Universidad de San Martín de Porres ...",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2731/07246887"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2731/07246887"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Prioriza seguridad ciudadana, pensiones para adultos mayores, agua potable, titulación de viviendas, empleo formal para jóvenes y crecimiento económico del 6 al 8%.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2731"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/67b637b0-e2f7-47cc-8b23-fa16be709cc2.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/57cca898-e581-4019-9be0-dd9c44076703.pdf"
        }
      ]
    }
  },
  {
    "name": "Charlie Carrasco Salazar",
    "slug": "charlie-carrasco-salazar",
    "party": "Partido Democrata Unido Peru",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Maestro en Derecho Constitucional — Universidad Nacional Federico Villarreal (Concluido). Doctorado: Doctor en Derecho — Universidad Nacional Federico Villarreal (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2867/40799023"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2867/40799023"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone declarar emergencia educativa, pensión 65 universal, hospitales en cada provincia, reducir el Estado, cadena perpetua para corruptos y mano dura contra el crimen.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2867"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/2e5235de-e828-45f0-92cc-017a830abc33.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/0479dbb9-475f-40fe-8288-df630419c7f4.pdf"
        }
      ]
    }
  },
  {
    "name": "Alex Gonzales Castillo",
    "slug": "alex-gonzales-castillo",
    "party": "Partido Democrata Verde",
    "education": {
      "score": "Medio",
      "explanation": "Administracion — Universidad Inca Garcilaso de la Vega (No concluido). Conciliacion Extrajudicial",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2895/09307547"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2895/09307547"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone mejorar educación y salud, reducir pobreza y violencia contra la mujer, bajar la informalidad laboral al 55%, luchar contra la corrupción y proteger la Amazonía.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2895"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/3f2a939b-edf2-4505-b709-df775a5e0038.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/49c261f9-1d57-4d77-a5d3-b3f5b4562ba7.pdf"
        }
      ]
    }
  },
  {
    "name": "Herbert Caller Gutierrez",
    "slug": "herbert-caller-gutierrez",
    "party": "Partido Patriotico del Peru",
    "education": {
      "score": "Bajo",
      "explanation": "Postgrado: Post Grado — Instituto Nacional de Investigacion y Capacitacion de Telecomunicaciones - Inictel (Concluido). Bachiller en Ciencias — Universidad Nacional de Ingeniería (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2869/43409673"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2869/43409673"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone mano dura contra el crimen organizado con inteligencia militar-policial, construir megapenales de máxima seguridad, nueva Constitución y descontaminar ríos y lagos.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2869"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/6de519cb-bb4d-4319-a11b-be65d4438f4f.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/a45d799b-a8c3-4505-9d13-73a4289fd9ee.pdf"
        }
      ]
    }
  },
  {
    "name": "Wolfgang Mario Grozo Costa",
    "slug": "wolfgang-mario-grozo-costa",
    "party": "Partido Politico Integridad Democratica",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Maestro en Desarrollo y Defensa Nacional — Centro de Altos Estudios Nacionales - Caen (Concluido). Doctorado: Doctor en Desarrollo y Seguridad Estrategica — Centro de Altos Estudios Nacio...",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2985/07260881"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Medio",
      "explanation": "Tiene anotaciones en su declaración ante el JNE. Revisa la fuente.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2985/07260881"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone reconstruir escuelas, comprar un satélite, construir autopistas y trenes, crear el Ministerio de Ciencia, agua potable para todos y luchar contra la corrupción.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2985"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/ee89ac99-516b-4665-9297-413a0cf104de.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/4229a340-5d25-45c0-87dc-3f18d294c22c.pdf"
        }
      ]
    }
  },
  {
    "name": "Pablo Alfonso Lopez Chau Nava",
    "slug": "pablo-alfonso-lopez-chau-nava",
    "party": "Ahora Nacion - An",
    "education": {
      "score": "Bajo",
      "explanation": "Doctorado: Grado de Doctor en Economía — Universidad Nacional Autónoma de México (Concluido). Maestría: Grado de Maestro en Economía — Universidad Nacional Autónoma de México (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2980/25331980"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2980/25331980"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Prioriza salud universal con telemedicina y cobertura total, mejorar educación en lectura y matemáticas, cerrar la brecha de vivienda y garantizar agua potable para todos.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2980"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/7d70c5e1-2246-42e8-90c2-372aa1cf7f52.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/f935e50c-929a-4279-a4de-6c03c6c24b8b.pdf"
        }
      ]
    }
  },
  {
    "name": "Armando Joaquin Masse Fernandez",
    "slug": "armando-joaquin-masse-fernandez",
    "party": "Partido Democratico Federal",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Magister en Administracion Estrategica de Empresas — Pontificia Universidad Católica del Perú (Concluido). Postgrado: Maestria en Propiedad Intelectual y Competencia — Pontificia Universi...",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2986/08255194"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Alto",
      "explanation": "Declaró sentencia(s) ante el JNE. Revisa la fuente.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2986/08255194"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Medio",
      "explanation": "Plan de gobierno registrado pero sin documentos descargables al momento de la consulta.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2986"
        }
      ]
    }
  },
  {
    "name": "Yonhy Lescano Ancieta",
    "slug": "yonhy-lescano-ancieta",
    "party": "Partido Politico Cooperacion Popular",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Grado de Magíster en Derecho (grado de Maestro) — Universidad de Chile (Concluido). Bachiller en Derecho — Universidad Católica de Santa María (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2995/01211014"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2995/01211014"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone reducir desigualdad y pobreza, educación intercultural y digital, integración económica andina, energías renovables y adaptación al cambio climático.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2995"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/582e0d55-19ee-4a7f-85ef-c254be5bada6.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/690d981f-30bb-4487-8d17-b995579c522b.pdf"
        }
      ]
    }
  },
  {
    "name": "Fiorella Giannina Molinelli Aristondo",
    "slug": "fiorella-giannina-molinelli-aristondo",
    "party": "Fuerza y Libertad",
    "education": {
      "score": "Bajo",
      "explanation": "Doctorado: Doctora en Gobierno y Politica Publica — Universidad de San Martín de Porres (Concluido). Bachiller en Ciencias Sociales Con Mencion en Economia — Pontificia Universidad Católica del Per...",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/3024/25681995"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/3024/25681995"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone historia clínica única digital, telemedicina rural, reforma policial contra extorsión, gobierno digital al 90%, reducir informalidad y formalizar la minería.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/3024"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/d4ab9fba-d366-4083-bbf5-63aa465114d9.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/de628fd3-12db-4fad-9880-e8614e2359b6.pdf"
        }
      ]
    }
  },
  {
    "name": "Roberto Enrique Chiabra Leon",
    "slug": "roberto-enrique-chiabra-leon",
    "party": "Unidad Nacional",
    "education": {
      "score": "Medio",
      "explanation": "Bachiller en Ciencias Militares — Escuela Militar de Chorrillos “coronel Francisco Bolognesi” (Concluido). Licenciado en Ciencias Militares — Escuela Militar de Chorrillos “coronel Francisco Bologn...",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/3023/40728264"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/3023/40728264"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone combatir anemia infantil, mejorar la atención primaria de salud, recuperar el orden y seguridad con más policías, fusionar ministerios e impulsar agricultura y turismo.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/3023"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/ae0c9ba2-6278-4ca7-b077-16ed2cc39e76.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/030f130b-7d76-4e2f-a9f4-99fd09e5c74a.pdf"
        }
      ]
    }
  },
  {
    "name": "Mesias Antonio Guevara Amasifuen",
    "slug": "mesias-antonio-guevara-amasifuen",
    "party": "Partido Morado",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Magister en Administracion de Empresas — Universidad Peruana de Ciencias Aplicadas S.a.c. (Concluido). Bachiller en Ingenieria Electronica — Universidad Ricardo Palma (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2840/09871134"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2840/09871134"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone industrializar el Perú, reducir déficit de vivienda, descentralizar universidades, crear cárceles productivas, línea aérea de bandera y combatir la minería ilegal.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2840"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/6eb5d4b8-bd18-4cf0-ae0e-e250ca085f5f.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/438a1d07-1ffb-4d88-a044-5e9a73097ce2.pdf"
        }
      ]
    }
  },
  {
    "name": "Luis Fernando Olivera Vega",
    "slug": "luis-fernando-olivera-vega",
    "party": "Partido Frente de la Esperanza 2021",
    "education": {
      "score": "Medio",
      "explanation": "Bachiller en Ciencias Con Mencion en Administracion — Universidad del Pacífico (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2857/06280714"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2857/06280714"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone eliminar la desnutrición infantil, crear viviendas para jóvenes, invertir 7% del PBI en salud, reducir el IGV al 10% y crear un millón de empleos formales al año.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2857"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/d656b83f-3177-4053-a381-0f36ec99490a.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/a29bd31b-ba8f-403c-ac52-9d43d3782c7b.pdf"
        }
      ]
    }
  },
  {
    "name": "Jose Daniel Williams Zapata",
    "slug": "jose-daniel-williams-zapata",
    "party": "Avanza Pais - Partido de Integracion Social",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Magister en Desarrollo y Defensa Nacional — Centro de Altos Estudios Nacionales - Caen (Concluido). Bachiller en Ciencias Militares — Escuela Militar de Chorrillos “coronel Francisco Bolo...",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2173/43287528"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Medio",
      "explanation": "Tiene anotaciones en su declaración ante el JNE. Revisa la fuente.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2173/43287528"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Busca integrar el sistema de salud con enfoque preventivo, reducir la informalidad laboral al 50%, modernizar hospitales con tecnología digital y fortalecer partidos políticos.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2173"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/5857261c-789e-4599-ac05-4531654b10b4.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/cb71b186-9375-402c-be01-81fde4a4f3e7.pdf"
        }
      ]
    }
  },
  {
    "name": "Vladimir Roy Cerron Rojas",
    "slug": "vladimir-roy-cerron-rojas",
    "party": "Partido Politico Nacional Peru Libre",
    "education": {
      "score": "Bajo",
      "explanation": "Doctorado: Doctor en Medicina — Universidad Nacional Mayor de San Marcos (Concluido). Maestría: Magister en Neurociencias — Universidad Nacional Mayor de San Marcos (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2218/06466585"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Alto",
      "explanation": "Declaró sentencia(s) ante el JNE. Revisa la fuente.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2218/06466585"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Plantea un Sistema Único de Salud público y gratuito, educación pública con conectividad digital universal, crear universidades públicas regionales y agua potable para todos.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2218"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/b2d25860-484e-4226-bd13-a57fb83c59cb.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/f4681d3f-c1ea-486b-a795-547995c21d33.pdf"
        }
      ]
    }
  },
  {
    "name": "Rafael Jorge Belaunde Llosa",
    "slug": "rafael-jorge-belaunde-llosa",
    "party": "Libertad Popular",
    "education": {
      "score": "Medio",
      "explanation": "Bachiller en Economia — Universidad de Lima (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2933/10219647"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2933/10219647"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Prioriza seguridad ciudadana contra el crimen organizado, vivienda digna, reducir anemia infantil, mejorar educación y luchar contra la corrupción.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2933"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/30bab146-a532-4d1b-87a7-e0f8078dc70b.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/77f7d01e-0ae1-4bff-8763-4e18303733c0.pdf"
        }
      ]
    }
  },
  {
    "name": "Maria Soledad Perez Tello de Rodriguez",
    "slug": "maria-soledad-perez-tello-de-rodriguez",
    "party": "Primero la Gente - Comunidad, Ecologia, Libertad y Progreso",
    "education": {
      "score": "Bajo",
      "explanation": "Postgrado: Maestria en Derecho Constitucional — Pontificia Universidad Catolica del Peru (Concluido). Abogado — Universidad de San Martín de Porres (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2931/07867789"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2931/07867789"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Enfocada en educación de calidad cerrando brechas rurales, unificar el sistema de salud, reducir la desnutrición infantil y fortalecer la formación docente en zonas vulnerables.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2931"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/1430b48a-b7d1-4acf-970e-7c5e58f450c2.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/1d58a0ed-0df0-4000-9792-df5ddd53ea2f.pdf"
        }
      ]
    }
  },
  {
    "name": "Antonio Ortiz Villano",
    "slug": "antonio-ortiz-villano",
    "party": "Salvemos al Peru",
    "education": {
      "score": "Alto",
      "explanation": "Habilidades Gerenciales — Pucp. I-Week Program en Comunicacion Politica, Gobernabilidad y Derecho",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2927/08587486"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2927/08587486"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Propone reducir deserción escolar, mejorar desarrollo infantil temprano con nutrición, implementar metodología STEAM en escuelas y fortalecer becas educativas.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2927"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/40877746-e670-42d3-840b-cdf683f46355.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/bf527749-0c7c-4642-a1d5-b8f15b4a8945.pdf"
        }
      ]
    }
  },
  {
    "name": "Jorge Nieto Montesinos",
    "slug": "jorge-nieto-montesinos",
    "party": "Partido del Buen Gobierno",
    "education": {
      "score": "Bajo",
      "explanation": "Maestría: Maestría en Ciencias Sociales Con Mención en Sociologia. — Facultad Latinoamericana de Ciencias Sociales (Concluido). Bachiller en Ciencias Sociales Con Mencion en Sociologia — Pontificia...",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2961/06506278"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Medio",
      "explanation": "Tiene anotaciones en su declaración ante el JNE. Revisa la fuente.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2961/06506278"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Busca un sistema de salud integrado, reducir informalidad laboral al 50%, combatir minería ilegal, diversificar la energía con renovables al 70% y meritocracia estatal.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2961"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/19bde703-f7f4-4715-92f3-b82e19bbe651.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/a8762e2b-b6e6-4d27-84e4-4f0da5fc17b7.pdf"
        }
      ]
    }
  },
  {
    "name": "Carlos Gonsalo Alvarez Loayza",
    "slug": "carlos-gonsalo-alvarez-loayza",
    "party": "Partido Pais Para Todos",
    "education": {
      "score": "Alto",
      "explanation": "Secundaria completa. Primaria completa",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2956/06002034"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2956/06002034"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Busca reducir anemia y pobreza con programas sociales focalizados, dar internet a todas las escuelas, apoyar agricultura familiar y sembrar 40 millones de árboles.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2956"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/76291ee3-eba2-4c88-adef-2530f2d70bb8.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/fea1dba2-01b1-4831-ab7e-fbd1db6591c9.pdf"
        }
      ]
    }
  },
  {
    "name": "Paul Davis Jaimes Blanco",
    "slug": "paul-davis-jaimes-blanco",
    "party": "Progresemos",
    "education": {
      "score": "Bajo",
      "explanation": "Postgrado: Gobierno y Gestión Publica — Instituto de Gobierno y Gestión Publica Universidad San Martin de Porres (Concluido). Bachiller en Derecho y Ciencia Politica — Universidad de San Martín de ...",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2967/40139245"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2967/40139245"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Prioriza salud con más establecimientos rurales, reducir anemia infantil, luchar contra la corrupción con IA, combatir el crimen organizado y proteger la biodiversidad.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2967"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/b2f303a2-1e0d-4933-9d5f-04682a3710b0.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/ed137d45-cf88-47c0-9f15-4b10fd2107ea.pdf"
        }
      ]
    }
  },
  {
    "name": "Walter Gilmer Chirinos Purizaga",
    "slug": "walter-gilmer-chirinos-purizaga",
    "party": "Partido Politico Prin",
    "education": {
      "score": "Bajo",
      "explanation": "Postgrado: Maestria en Gestion Publica — Universidad Nacional Enrique Guzman y Valle. Contador Público — Universidad Privada Telesup S.a.c. (Concluido)",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2921/18870364"
        },
        {
          "title": "Verificar grado — SUNEDU",
          "url": "https://enlinea.sunedu.gob.pe/"
        }
      ]
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Sin alertas en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2921/18870364"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ]
    },
    "plan": {
      "score": "Bajo",
      "explanation": "Plantea lucha frontal contra la criminalidad, reducir informalidad laboral al 50%, combatir la corrupción, crecer al 5% anual del PBI y frenar la deforestación amazónica.",
      "sources": [
        {
          "title": "Fórmula presidencial — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/formula-presidencial/2921"
        },
        {
          "title": "Plan de gobierno completo (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/3b89548c-81fa-479d-9ff9-2b7011fec7d2.pdf"
        },
        {
          "title": "Resumen del plan de gobierno (PDF)",
          "url": "https://mpesije.jne.gob.pe/docs/4ab0caad-f051-42a3-b3f8-236ba7df2e3b.pdf"
        }
      ]
    }
  }
];

/**
 * Viabilidad de planes de gobierno — evaluada con IA (GPT-4o).
 * Criterios objetivos: especificidad, viabilidad fiscal, capacidad institucional,
 * precedentes y coherencia. Escala 1-10. Sin sesgo político.
 * Generado por scripts/generate-plan-feasibility.py
 */
const planFeasibility: Record<string, FeasibilityScore> = {
  "rosario-del-pilar-fernandez-bazan": { especificidad: 7, viabilidadFiscal: 6, capacidadInstitucional: 5, precedentes: 6, coherencia: 7, promedio: 6.2, resumen: "El plan presenta metas específicas y mecanismos de rendición de cuentas, pero enfrenta desafíos en financiamiento y capacidad institucional para su implementación." },
  "george-patrick-forsyth-sommer": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas específicas y cuantificables, pero su financiamiento y capacidad institucional son cuestionables. Existen precedentes positivos en algunas áreas propuestas." },
  "roberto-helbert-sanchez-palomino": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas específicas y cuantificables, pero su financiación es cuestionable. La capacidad institucional es moderada, y hay precedentes positivos en políticas similares." },
  "pitter-enrique-valderrama-pena": { especificidad: 7, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 6, coherencia: 7, promedio: 6.2, resumen: "El plan presenta metas específicas y cuantificables, pero su financiamiento y capacidad institucional son preocupantes. Hay precedentes mixtos en políticas similares." },
  "alvaro-gonzalo-paz-de-la-barra-freigeiro": { especificidad: 8, viabilidadFiscal: 6, capacidadInstitucional: 5, precedentes: 7, coherencia: 8, promedio: 6.8, resumen: "El plan tiene metas específicas y coherentes, pero su implementación enfrenta desafíos fiscales y de capacidad institucional que podrían limitar su viabilidad." },
  "ricardo-pablo-belmont-cassinelli": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan tiene metas específicas y medibles, pero su viabilidad fiscal es cuestionable y requiere reformas significativas en la capacidad institucional para su implementación." },
  "ronald-darwin-atencio-sotomayor": { especificidad: 6, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 4, coherencia: 5, promedio: 5.2, resumen: "El plan presenta metas y objetivos claros, pero su implementación requiere recursos y reformas significativas. La capacidad institucional es moderada y hay precedentes limitados." },
  "rafael-bernardo-lopez-aliaga-cazorla": { especificidad: 6, viabilidadFiscal: 5, capacidadInstitucional: 4, precedentes: 6, coherencia: 5, promedio: 5.2, resumen: "El plan presenta metas específicas y algunos indicadores, pero enfrenta desafíos en financiamiento y capacidad institucional para su implementación efectiva." },
  "cesar-acuna-peralta": { especificidad: 8, viabilidadFiscal: 6, capacidadInstitucional: 5, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas concretas y medibles, pero su financiamiento y capacidad institucional son desafiantes. Hay precedentes positivos, aunque la implementación puede ser compleja." },
  "keiko-sofia-fujimori-higuchi": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas específicas y cuantificables, pero su financiamiento y capacidad institucional son desafiantes. Hay precedentes positivos, aunque la coherencia es moderada." },
  "napoleon-becerra-garcia": { especificidad: 4, viabilidadFiscal: 5, capacidadInstitucional: 4, precedentes: 6, coherencia: 5, promedio: 4.8, resumen: "El plan presenta algunas metas concretas, pero carece de detalles específicos sobre su implementación. La viabilidad fiscal es cuestionable y la capacidad institucional es limitada." },
  "alfonso-carlos-espa-y-garces-alvear": { especificidad: 6, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 6, coherencia: 5, promedio: 5.4, resumen: "El plan presenta metas específicas y algunos indicadores, pero su viabilidad fiscal y capacidad institucional son moderadas, lo que limita su realizabilidad." },
  "francisco-ernesto-diez-canseco-tavara": { especificidad: 6, viabilidadFiscal: 5, capacidadInstitucional: 4, precedentes: 6, coherencia: 5, promedio: 5.2, resumen: "El plan presenta metas cuantificables y plazos, pero su implementación requiere reformas significativas y enfrenta desafíos fiscales y de capacidad institucional." },
  "mario-enrique-vizcarra-cornejo": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas específicas y medibles, pero su financiamiento y capacidad institucional son cuestionables. Existen precedentes positivos en algunas áreas propuestas." },
  "carlos-ernesto-jaico-carranza": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan tiene metas específicas y un enfoque claro, pero su financiamiento y capacidad institucional son desafiantes. Se basa en precedentes positivos, aunque la coherencia presenta algunas tensiones." },
  "jose-leon-luna-galvez": { especificidad: 6, viabilidadFiscal: 5, capacidadInstitucional: 4, precedentes: 6, coherencia: 5, promedio: 5.2, resumen: "El plan presenta metas cuantificables y plazos, pero su implementación enfrenta desafíos fiscales e institucionales significativos, lo que limita su viabilidad general." },
  "charlie-carrasco-salazar": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas específicas y medibles, pero su viabilidad fiscal es cuestionable y requiere reformas significativas en instituciones existentes." },
  "alex-gonzales-castillo": { especificidad: 7, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 6, coherencia: 7, promedio: 6.2, resumen: "El plan presenta metas específicas y cuantificables, pero su financiamiento y capacidad institucional son desafiantes. Hay precedentes mixtos en políticas similares." },
  "herbert-caller-gutierrez": { especificidad: 6, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 6, coherencia: 7, promedio: 5.8, resumen: "El plan presenta metas concretas y algunas cifras, pero carece de detalles en financiamiento y capacidad institucional. La coherencia es aceptable, aunque se requieren reformas significativas." },
  "wolfgang-mario-grozo-costa": { especificidad: 8, viabilidadFiscal: 6, capacidadInstitucional: 5, precedentes: 6, coherencia: 7, promedio: 6.4, resumen: "El plan presenta metas específicas y cuantificables, pero su implementación enfrenta desafíos fiscales y de capacidad institucional. La coherencia es aceptable, aunque requiere reformas significativas." },
  "pablo-alfonso-lopez-chau-nava": { especificidad: 6, viabilidadFiscal: 4, capacidadInstitucional: 5, precedentes: 6, coherencia: 7, promedio: 5.6, resumen: "El plan presenta metas específicas, pero su financiamiento es incierto y requiere reformas. La capacidad institucional es moderada, con precedentes mixtos en salud y educación." },
  "yonhy-lescano-ancieta": { especificidad: 6, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 4, coherencia: 5, promedio: 5.2, resumen: "El plan presenta metas concretas pero carece de detalles en financiamiento y precedentes claros. La capacidad institucional es moderada, lo que limita su viabilidad." },
  "fiorella-giannina-molinelli-aristondo": { especificidad: 8, viabilidadFiscal: 6, capacidadInstitucional: 5, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas concretas y medibles, pero su implementación enfrenta desafíos fiscales y de capacidad institucional. Existen precedentes positivos en algunas áreas." },
  "roberto-enrique-chiabra-leon": { especificidad: 6, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 5, coherencia: 6, promedio: 5.4, resumen: "El plan presenta metas concretas y un enfoque en la formalización, pero carece de detalles claros de financiamiento y ejecución, lo que limita su viabilidad." },
  "mesias-antonio-guevara-amasifuen": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas concretas y medibles, pero su financiamiento y capacidad institucional son cuestionables. Hay precedentes positivos, aunque la coherencia es variable." },
  "luis-fernando-olivera-vega": { especificidad: 6, viabilidadFiscal: 5, capacidadInstitucional: 4, precedentes: 6, coherencia: 5, promedio: 5.2, resumen: "El plan presenta metas concretas, pero su implementación enfrenta desafíos fiscales y de capacidad institucional. Existen precedentes mixtos en políticas similares." },
  "jose-daniel-williams-zapata": { especificidad: 7, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 6, coherencia: 7, promedio: 6.2, resumen: "El plan presenta metas específicas y coherentes, pero su financiamiento y capacidad institucional son desafiantes. Hay precedentes mixtos en políticas similares." },
  "vladimir-roy-cerron-rojas": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas específicas y cuantificables, pero su financiamiento y capacidad institucional son desafiantes. Existen precedentes positivos en políticas similares." },
  "rafael-jorge-belaunde-llosa": { especificidad: 7, viabilidadFiscal: 6, capacidadInstitucional: 5, precedentes: 6, coherencia: 7, promedio: 6.2, resumen: "El plan tiene metas específicas y coherentes, pero enfrenta desafíos en viabilidad fiscal y capacidad institucional para su implementación efectiva." },
  "maria-soledad-perez-tello-de-rodriguez": { especificidad: 8, viabilidadFiscal: 6, capacidadInstitucional: 5, precedentes: 7, coherencia: 8, promedio: 6.8, resumen: "El plan presenta metas específicas y medibles, pero su implementación depende de reformas fiscales y capacidad institucional limitada. Hay precedentes positivos en educación técnica." },
  "antonio-ortiz-villano": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan tiene metas específicas y medibles, pero su financiamiento y capacidad institucional son limitados. Existen precedentes positivos en políticas similares." },
  "jorge-nieto-montesinos": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas específicas y cuantificables, pero su viabilidad fiscal es cuestionable. La capacidad institucional y precedentes son moderados, lo que limita su realización." },
  "carlos-gonsalo-alvarez-loayza": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan tiene metas específicas y medibles, pero su financiamiento y capacidad institucional son desafiantes. Existen precedentes positivos en políticas similares." },
  "paul-davis-jaimes-blanco": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas específicas y cuantificables, pero su financiamiento y capacidad institucional son preocupantes. Existen precedentes positivos en algunas áreas." },
  "walter-gilmer-chirinos-purizaga": { especificidad: 8, viabilidadFiscal: 5, capacidadInstitucional: 6, precedentes: 7, coherencia: 6, promedio: 6.4, resumen: "El plan presenta metas concretas y medibles, pero su financiamiento y capacidad institucional son desafiantes. Hay precedentes positivos, aunque la coherencia es moderada." },
};

export function getFeasibility(slug: string): FeasibilityScore | undefined {
  return planFeasibility[slug];
}

/**
 * Orden basado en encuestas nacionales (Condor LATAM, marzo 2026).
 * Candidatos con mayor intención de voto aparecen primero.
 * Los no incluidos se ordenan alfabéticamente después.
 */
const pollOrder: Record<string, number> = {
  "keiko-sofia-fujimori-higuchi": 1,
  "rafael-bernardo-lopez-aliaga-cazorla": 2,
  "pablo-alfonso-lopez-chau-nava": 3,
  "cesar-acuna-peralta": 4,
  "carlos-gonsalo-alvarez-loayza": 5,
  "mario-enrique-vizcarra-cornejo": 6,
  "jose-leon-luna-galvez": 7,
  "george-patrick-forsyth-sommer": 8,
};

function sortByPollOrder(list: Candidate[]): Candidate[] {
  return [...list].sort((a, b) => {
    const pa = pollOrder[a.slug] ?? 999;
    const pb = pollOrder[b.slug] ?? 999;
    if (pa !== pb) return pa - pb;
    return a.name.localeCompare(b.name, "es");
  });
}

const sortedCandidates = sortByPollOrder(candidates);

export function getCandidateBySlug(slug: string): Candidate | undefined {
  return candidates.find((c) => c.slug === slug);
}

export function searchCandidates(query: string): Candidate[] {
  const q = query.toLowerCase().trim();
  if (!q) return sortedCandidates;
  return sortedCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.party.toLowerCase().includes(q) ||
      c.slug.includes(q)
  );
}
