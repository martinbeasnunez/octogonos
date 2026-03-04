export type ScoreLevel = "Alto" | "Medio" | "Bajo";
export type PillarType = "education" | "legal" | "plan";

const pillarDisplayLabels: Record<PillarType, Record<ScoreLevel, string>> = {
  education: { Bajo: "POSGRADO", Medio: "PREGRADO", Alto: "TÉCNICA" },
  legal: { Bajo: "NO REPORTA", Medio: "PROCESO", Alto: "SENTENCIA" },
  plan: { Bajo: "COMPLETO", Medio: "PARCIAL", Alto: "SIN PLAN" },
};

export function getDisplayLabel(pillar: PillarType, score: ScoreLevel): string {
  return pillarDisplayLabels[pillar][score];
}

const scoreDescriptions: Record<PillarType, Record<ScoreLevel, string>> = {
  education: {
    Bajo: "Declaró posgrado (maestría o doctorado) ante el JNE",
    Medio: "Declaró estudios universitarios ante el JNE",
    Alto: "Declaró educación técnica o básica ante el JNE",
  },
  legal: {
    Bajo: "No reportó problemas legales en su declaración ante el JNE",
    Medio: "Registra anotaciones o procesos pendientes",
    Alto: "Declaró sentencia(s) en su hoja de vida",
  },
  plan: {
    Bajo: "Plan de gobierno registrado ante el JNE",
    Medio: "Plan parcialmente disponible",
    Alto: "No registra plan de gobierno",
  },
};

export function getScoreDescription(pillar: PillarType, score: ScoreLevel): string {
  return scoreDescriptions[pillar][score];
}

/** Color semáforo: verde (bueno), ámbar (medio), rojo (alto). Consistente con octágonos. */
export function getBadgeColor(_pillar: PillarType, score: ScoreLevel, hasContext?: boolean): string {
  if (score === "Alto") return "bg-voraz-red/10 text-voraz-red";
  if (score === "Medio") return "bg-voraz-gold/10 text-voraz-gold";
  if (hasContext) return "bg-voraz-gold/10 text-voraz-gold";
  return "bg-score-bajo/10 text-score-bajo";
}

export interface Source {
  title: string;
  url: string;
}

export interface PublicContext {
  text: string;
  source: string;
  sourceUrl?: string;
}

export interface PillarScore {
  score: ScoreLevel;
  explanation: string;
  sources: Source[];
  /** Contexto público generado por IA — noticias o reportes relevantes */
  context?: PublicContext;
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
      "explanation": "No declaró anotaciones ni procesos en su hoja de vida ante el JNE.",
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
      "explanation": "Presenta una anotación por proceso civil ante el JNE.",
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
      "explanation": "No declaró alertas en su hoja de vida ante el JNE.",
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
      "explanation": "No declaró alertas en su hoja de vida ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2930/43632186"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "En 2012, Enrique Valderrama, candidato del APRA, fue acusado de hurto de una laptop y un televisor.",
        "source": "La República",
        "sourceUrl": "https://larepublica.pe/politica/2025/12/01/enrique-valderrama-candidato-del-apra-fue-acusado-en-el-hurto-de-una-laptop-y-un-televisor-en-el-2012-hnews-11717/"
      }
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
      "explanation": "Presenta una anotación por proceso civil ante el JNE.",
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
      "explanation": "Tiene una anotación por proceso civil en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2941/09177250"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "Según La Razón, en septiembre de 2023, la Fiscalía solicitó 7 años de prisión efectiva para Ricardo Belmont por usurpación y hurto agravado en relación con la toma violenta del local de PBO Radio en el Morro Solar.",
        "source": "La Razón",
        "sourceUrl": "https://larazon.pe/fiscalia-pide-7-anos-de-prision-efectiva-para-ricardo-belmont/"
      }
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
      ],
      "context": {
        "text": "En enero de 2026, RPP Noticias reportó que el estudio jurídico Athena, fundado por Ronald Atencio Sotomayor, candidato presidencial de Alianza Venceremos, fue denunciado por ofrecer servicios irregulares en la elaboración de tesis para estudiantes universitarios.",
        "source": "RPP Noticias",
        "sourceUrl": "https://rpp.pe/politica/estado/denuncian-que-estudio-juridico-fundado-por-ronald-atencio-ofrece-servicio-irregular-de-elaboracion-de-tesis-noticia-1671230"
      }
    },
    "legal": {
      "score": "Bajo",
      "explanation": "No declaró alertas en su hoja de vida ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/3025/41373494"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "Según El Comercio, Ronald Atencio, candidato presidencial de la alianza Venceremos, fue intervenido por la policía mientras conducía un vehículo con orden de captura por robo agravado y luego por insultar a efectivos en una comisaría.",
        "source": "El Comercio",
        "sourceUrl": "https://elcomercio.pe/politica/elecciones/el-legajo-oculto-de-ronald-atencio-candidato-presidencial-fue-intervenido-en-auto-requerido-por-robo-y-por-insultar-a-pnp-elecciones-2026-venceremos-voces-del-pueblo-candidatos-tlcnota-noticia/"
      }
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
      "explanation": "Su hoja de vida ante el JNE no presenta alertas ni inhabilitaciones.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/22/07845838"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "Según La República, en febrero de 2026, la Fiscalía abrió una investigación preliminar contra Rafael López Aliaga por la presunta destrucción y alteración de bienes culturales en el Centro Histórico de Lima, específicamente por la demolición de casonas históricas protegidas.",
        "source": "La República",
        "sourceUrl": "https://larepublica.pe/politica/2026/02/13/rafael-lopez-aliaga-fiscalia-investiga-a-lider-de-renovacion-popular-por-presunta-destruccion-de-casonas-hnews-1085412"
      }
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
      ],
      "context": {
        "text": "En 2016, la Universidad de Lima confirmó evidencias de plagio en la tesis de maestría de César Acuña, detectando copias literales sin mención de fuente y otras irregularidades.",
        "source": "RPP",
        "sourceUrl": "https://rpp.pe/peru/actualidad/universidad-de-lima-confirma-evidencias-de-plagio-en-tesis-de-cesar-acuna-noticia-996666"
      }
    },
    "legal": {
      "score": "Bajo",
      "explanation": "Su declaración ante el JNE no presenta alertas ni observaciones.",
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
      "explanation": "Declaró estudios de posgrado en su hoja de vida ante el JNE. Verificar grado en SUNEDU.",
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
      "explanation": "Tiene una anotación por proceso civil en su declaración ante el JNE.",
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
      "explanation": "Licenciado en Administración — Universidad Inca Garcilaso de la Vega Asociación Civil (concluido). Bachiller en Ciencias Administrativas — Universidad Inca Garcilaso de la Vega Asociación Civil (concluido).",
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
      "explanation": "Presenta una anotación por proceso civil ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2939/08058852"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "En junio de 2025, La República reportó que Napoleón Becerra, precandidato presidencial y presidente del Partido de los Trabajadores y Emprendedores (PTE), fue denunciado por presunta violencia sexual durante un evento político en Piura.",
        "source": "La República",
        "sourceUrl": "https://larepublica.pe/politica/2025/06/27/elecciones-2026-napoleon-becerra-precandidato-presidencial-es-denunciado-por-presunta-ataque-sexual-hnews-1838430"
      }
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
      "explanation": "Presenta una anotación por proceso civil ante el JNE.",
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
      "explanation": "Presenta una anotación por proceso civil ante el JNE.",
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
      "explanation": "Su declaración ante el JNE no presenta alertas ni observaciones.",
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
      "explanation": "Doctorado: Doctor en Educación — Universidad de San Martín de Porres (concluido). Maestría: Maestro en Economía Mención en Comercio y Finanzas Internacionales — Universidad de San Martín de Porres (concluido). Bachiller en Educación — Universidad de San Martín de Porres (concluido).",
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
      "explanation": "No declaró anotaciones por procesos civiles en su hoja de vida ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2731/07246887"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "Según RPP, en agosto de 2025, la Fiscalía solicitó 22 años y 8 meses de prisión contra José Luna Gálvez por presuntas irregularidades en la inscripción de Podemos Perú.",
        "source": "RPP",
        "sourceUrl": "https://rpp.pe/politica/judiciales/fiscalia-pide-22-anos-y-8-meses-de-prision-contra-jose-luna-galvez-por-presuntas-irregularidades-en-inscripcion-de-podemos-peru-noticia-1649434"
      }
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
      "explanation": "Su hoja de vida ante el JNE no presenta alertas ni observaciones.",
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
      "explanation": "No declaró alertas en su hoja de vida ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2895/09307547"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "Según La República, Álex González Castillo, candidato presidencial del Partido Demócrata Verde, enfrenta seis investigaciones fiscales por presuntos delitos como falsificación documentaria y omisión de la obligación de proveer alimentos.",
        "source": "La República",
        "sourceUrl": "https://larepublica.pe/politica/2025/12/21/cuatro-candidatos-cuentan-con-la-mayor-cantidad-de-investigaciones-fiscales-keiko-fujimori-rafael-lopez-aliaga-cesar-acuna-alex-gonzalez-castillo-hnews-1081380/"
      }
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
      "explanation": "No declaró alertas ni anotaciones en su hoja de vida ante el JNE.",
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
      "explanation": "Doctorado: Doctor en Desarrollo y Seguridad Estratégica — Centro de Altos Estudios Nacionales (en curso).",
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
      "explanation": "Presenta una anotación por proceso civil en su declaración ante el JNE.",
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
      "explanation": "No declaró anotaciones por procesos civiles en su hoja de vida ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2980/25331980"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "Según El Comercio, el Jurado Nacional de Elecciones inició un proceso sancionador contra Alfonso López Chau por presunta consignación de información falsa en su declaración jurada de hoja de vida.",
        "source": "El Comercio",
        "sourceUrl": "https://elcomercio.pe/politica/elecciones/elecciones-generales-2026-jee-inicia-proceso-sancionador-contra-alfonso-lopez-chau-y-mario-vizcarra-ultimas-noticia/"
      }
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
      "explanation": "Declaró estudios de posgrado en su hoja de vida ante el JNE. Verificar grado en SUNEDU.",
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
      "explanation": "Tiene una anotación por proceso civil ante el JNE.",
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
      "explanation": "Doctorado: Doctora en Gobierno y Política Pública — Universidad de San Martín de Porres (concluido). Bachiller en Ciencias Sociales con mención en Economía — Pontificia Universidad Católica del Perú (concluido).",
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
      "explanation": "Presenta una anotación por proceso civil ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/3024/25681995"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "Según El Comercio, Fiorella Molinelli enfrenta tres procesos fiscales por colusión y abuso de autoridad relacionados con su gestión en EsSalud y el caso Chinchero.",
        "source": "El Comercio",
        "sourceUrl": "https://elcomercio.pe/politica/candidata-fiorella-molinelli-acumula-tres-procesos-fiscales-esta-es-la-realidad-de-su-historial-de-denuncias-elecciones-2026-noticia/"
      }
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
      "explanation": "Licenciado en Ciencias Militares — Escuela Militar de Chorrillos “coronel Francisco Bolognesi” (concluido). Verificar grado en SUNEDU.",
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
      "explanation": "Su hoja de vida ante el JNE no presenta alertas ni observaciones.",
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
      "explanation": "Su declaración ante el JNE no presenta alertas ni observaciones.",
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
      "explanation": "Presenta una anotación por proceso civil ante el JNE.",
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
      "explanation": "Declaró estudios de posgrado en su hoja de vida ante el JNE. Verificar grado en SUNEDU.",
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
      "explanation": "Presenta una anotación por proceso civil en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2173/43287528"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "En febrero de 2026, el Jurado Electoral Especial de Lima Centro 1 inició un procedimiento sancionador contra José Williams Zapata por presunta omisión de información en su hoja de vida, relacionada con una sentencia por homicidio calificado; sin embargo, en febrero de 2026, el mismo organismo archivó el expediente, concluyendo que no existía sentencia condenatoria firme ni antecedentes penales vigentes contra el candidato.",
        "source": "RPP",
        "sourceUrl": "https://rpp.pe/politica/elecciones/jose-williams-jee-inicia-proceso-sancionador-en-su-contra-por-omision-de-sentencia-en-su-hoja-de-vida-noticia-1675347"
      }
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
      ],
      "context": {
        "text": "Según La República, en enero de 2026, el Poder Judicial confirmó la detención preventiva por 24 meses contra Vladimir Cerrón por presunta organización criminal y lavado de activos.",
        "source": "La República",
        "sourceUrl": "https://rpp.pe/politica/judiciales/pj-confirmo-detencion-preventiva-contra-vladimir-cerron-por-presunta-organizacion-criminal-y-lavado-de-activos-noticia-1670983"
      }
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
      "explanation": "Su declaración ante el JNE no presenta alertas ni observaciones.",
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
      "explanation": "No declaró anotaciones ni procesos en su hoja de vida ante el JNE.",
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
      "explanation": "Su hoja de vida ante el JNE no presenta alertas ni observaciones.",
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
      "explanation": "Posgrado en la Pontificia Universidad Católica del Perú (Concluido). Verificar grado en SUNEDU.",
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
      "explanation": "Registra una anotación por proceso civil ante el JNE.",
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
      "explanation": "Presenta una anotación por proceso civil ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2956/06002034"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "En enero de 2026, el Jurado Electoral Especial de Lima Centro 1 identificó que Carlos Álvarez, candidato presidencial por el partido País Para Todos, habría omitido declarar una sentencia judicial por peculado en su hoja de vida.",
        "source": "El Comercio",
        "sourceUrl": "https://elcomercio.pe/elecciones/carlos-alvarez-fiscalizacion-del-jee-lima-centro-1-dice-que-habria-omitido-declarar-sentencia-por-peculado-en-hoja-de-vida-ultimas-noticia/"
      }
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
      "explanation": "Postgrado: Gobierno y Gestión Pública — Instituto de Gobierno y Gestión Pública Universidad San Martín de Porres (concluido). Bachiller en Derecho y Ciencia Política — Universidad de San Martín de Porres (concluido).",
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
      "explanation": "No presenta anotaciones ni procesos en su declaración ante el JNE.",
      "sources": [
        {
          "title": "Hoja de vida — JNE Voto Informado",
          "url": "https://votoinformado.jne.gob.pe/hoja-vida/2967/40139245"
        },
        {
          "title": "Consulta de expedientes — Poder Judicial",
          "url": "https://cej.pj.gob.pe/cej/forms/busquedaform.html"
        }
      ],
      "context": {
        "text": "En diciembre de 2025, La República reportó que Paul Jaimes, candidato presidencial de Progresemos, minimizó las dos denuncias por violencia en su contra, asegurando que fue víctima de \"difamación\".",
        "source": "La República",
        "sourceUrl": "https://larepublica.pe/politica/2025/12/15/paul-jaimes-candidato-presidencial-de-progresemos-minimiza-denuncias-por-violencia-y-asegura-que-fue-difamado-hnews-1116480/"
      }
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
      "explanation": "Presenta una anotación por proceso civil ante el JNE.",
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
 * Datos de encuestas nacionales — promedio de encuestas publicadas en medios.
 * Última actualización: 1 marzo 2026.
 * Solo incluye candidatos con intención de voto reportada.
 */
export const pollData: Record<string, { order: number; pct: number }> = {
  "keiko-sofia-fujimori-higuchi": { order: 1, pct: 13.2 },
  "rafael-bernardo-lopez-aliaga-cazorla": { order: 2, pct: 12.5 },
  "pablo-alfonso-lopez-chau-nava": { order: 3, pct: 4.0 },
  "cesar-acuna-peralta": { order: 4, pct: 4.0 },
  "carlos-gonsalo-alvarez-loayza": { order: 5, pct: 4.0 },
  "mario-enrique-vizcarra-cornejo": { order: 6, pct: 4.0 },
  "jose-leon-luna-galvez": { order: 7, pct: 2.0 },
  "george-patrick-forsyth-sommer": { order: 8, pct: 2.0 },
};

export function getPollPct(slug: string): number | undefined {
  return pollData[slug]?.pct;
}

function sortByPollOrder(list: Candidate[]): Candidate[] {
  return [...list].sort((a, b) => {
    const pa = pollData[a.slug]?.order ?? 999;
    const pb = pollData[b.slug]?.order ?? 999;
    if (pa !== pb) return pa - pb;
    return a.name.localeCompare(b.name, "es");
  });
}

function sortAlphabetically(list: Candidate[]): Candidate[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

const sortedCandidates = sortByPollOrder(candidates);

export type SortOption = "encuestas" | "az";
export type FilterOption = "todos" | "sentencia" | "pendiente" | "posgrado" | "sin-plan" | "con-contexto" | "con-encuesta";

export const filterLabels: Record<FilterOption, string> = {
  todos: "Todos",
  sentencia: "Con sentencia",
  pendiente: "Proceso legal",
  posgrado: "Posgrado",
  "sin-plan": "Sin plan",
  "con-contexto": "Con contexto IA",
  "con-encuesta": "Con encuesta",
};

function applyFilter(list: Candidate[], filter: FilterOption): Candidate[] {
  if (filter === "todos") return list;
  return list.filter((c) => {
    switch (filter) {
      case "sentencia": return c.legal.score === "Alto";
      case "pendiente": return c.legal.score === "Medio";
      case "posgrado": return c.education.score === "Bajo";
      case "sin-plan": return c.plan.score === "Alto";
      case "con-contexto": return !!(c.education.context || c.legal.context);
      case "con-encuesta": return !!pollData[c.slug];
      default: return true;
    }
  });
}

export function queryCandidates(
  query: string,
  sort: SortOption = "encuestas",
  filter: FilterOption = "todos"
): Candidate[] {
  const q = query.toLowerCase().trim();
  let results = q
    ? candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.party.toLowerCase().includes(q) ||
          c.slug.includes(q)
      )
    : [...candidates];

  results = applyFilter(results, filter);

  return sort === "az"
    ? sortAlphabetically(results)
    : sortByPollOrder(results);
}

export function getCandidateBySlug(slug: string): Candidate | undefined {
  return candidates.find((c) => c.slug === slug);
}

/** @deprecated Use queryCandidates instead */
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
