import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Metodología — Octógonos",
  description:
    "Cómo funciona Octógonos: organizamos información pública de candidatos para que votes informado.",
};

export default function MetodologiaPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-voraz-gray-400 transition-colors hover:text-voraz-black"
      >
        <span>←</span> Inicio
      </Link>

      <div className="mb-12 animate-hero-reveal">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-voraz-black sm:text-5xl">
          Metodología
        </h1>
        <div className="mt-4 h-1 w-12 bg-voraz-red" />
      </div>

      <div className="space-y-12">
        {/* Cómo funciona */}
        <section>
          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
            Cómo funciona
          </span>
          <ul className="space-y-4">
            {[
              "Organizamos información de fuentes públicas oficiales (JNE, SUNEDU, Poder Judicial).",
              "Usamos IA para evaluar la viabilidad de planes de gobierno (especificidad, sostenibilidad, precedentes, etc.).",
              "No hacemos acusaciones ni afirmamos culpabilidad. Mostramos lo que los registros públicos reportan.",
              "Siempre incluimos enlaces a las fuentes originales para que el lector verifique por sí mismo.",
            ].map((text, i) => (
              <li
                key={i}
                className="flex items-start gap-4 text-sm leading-relaxed text-voraz-gray-600"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-voraz-red text-[11px] font-bold text-voraz-white">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
            <li className="flex items-start gap-4 text-sm leading-relaxed text-voraz-gray-600">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-voraz-red text-[11px] font-bold text-voraz-white">
                5
              </span>
              Si hay un error, lo corregimos públicamente en la sección de{" "}
              <Link
                href="/correcciones"
                className="text-voraz-red hover:underline"
              >
                correcciones
              </Link>
              .
            </li>
          </ul>
        </section>

        {/* Los 3 octógonos */}
        <section>
          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
            Los 3 octógonos
          </span>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                abbrev: "EDU",
                title: "Educación",
                desc: "¿Qué estudió el candidato? Tomamos el nivel de instrucción que declaró ante el JNE e incluimos enlace a SUNEDU para que verifiques sus grados y títulos.",
              },
              {
                abbrev: "LEG",
                title: "Situación Legal",
                desc: "¿Tiene problemas legales? Revisamos lo que el candidato declaró ante el JNE e incluimos enlace al Poder Judicial. No afirmamos culpabilidad.",
              },
              {
                abbrev: "PLAN",
                title: "Plan de Gobierno",
                desc: "¿Existe y es alcanzable el plan? Verificamos si registró plan ante el JNE y analizamos su viabilidad: especificidad, sostenibilidad fiscal, capacidad institucional, precedentes y coherencia. Puntuado 0-10 con IA.",
              },
            ].map((p) => (
              <div
                key={p.abbrev}
                className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]"
              >
                <div className="clip-octagon mb-3 flex h-10 w-10 items-center justify-center bg-voraz-black font-display text-[11px] font-black text-voraz-white">
                  {p.abbrev}
                </div>
                <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
                  {p.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-voraz-gray-500">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Fuentes oficiales */}
        <section>
          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
            Fuentes oficiales
          </span>
          <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
            <div className="space-y-4">
              {[
                {
                  label: "JNE",
                  desc: "Hoja de vida de cada candidato, fórmulas presidenciales y planes de gobierno vía Voto Informado.",
                },
                {
                  label: "SUNEDU",
                  desc: "Verificación de grados y títulos universitarios registrados.",
                },
                {
                  label: "PJ",
                  desc: "Consulta de Expedientes Judiciales del Poder Judicial (enlace de referencia).",
                },
              ].map((s) => (
                <div key={s.label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-voraz-gray-100 font-display text-[10px] font-bold text-voraz-black">
                    {s.label}
                  </span>
                  <p className="text-sm leading-relaxed text-voraz-gray-600">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Escala por pilar */}
        <section>
          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
            Clasificación por pilar
          </span>
          <div className="space-y-6">
            {[
              {
                abbrev: "EDU",
                title: "Educación",
                note: "Según declaración jurada ante el JNE. Verificar en SUNEDU.",
                rows: [
                  { label: "POSGRADO", desc: "Declaró posgrado (maestría o doctorado) ante el JNE.", color: "neutral" as const },
                  { label: "PREGRADO", desc: "Declaró estudios universitarios ante el JNE.", color: "neutral" as const },
                  { label: "TÉCNICA", desc: "Declaró educación técnica o básica ante el JNE.", color: "neutral" as const },
                ],
              },
              {
                abbrev: "LEG",
                title: "Situación Legal",
                note: "Según declaración jurada y registros públicos. No afirmamos culpabilidad.",
                rows: [
                  { label: "LIMPIO", desc: "No registra alertas en fuentes públicas.", color: "neutral" as const },
                  { label: "PROCESO", desc: "Registra anotaciones o procesos legales pendientes.", color: "amber" as const },
                  { label: "SENTENCIA", desc: "Declaró sentencia(s) en su hoja de vida.", color: "red" as const },
                ],
              },
              {
                abbrev: "PLAN",
                title: "Plan de Gobierno",
                note: "Registrado ante el JNE. Viabilidad evaluada con IA.",
                rows: [
                  { label: "COMPLETO", desc: "Plan de gobierno registrado ante el JNE + viabilidad evaluada.", color: "neutral" as const },
                  { label: "PARCIAL", desc: "Plan parcialmente disponible o viabilidad con restricciones.", color: "amber" as const },
                  { label: "SIN PLAN", desc: "No registra plan de gobierno o viabilidad muy baja (≤4/10).", color: "red" as const },
                ],
              },
            ].map((pillar) => (
              <div
                key={pillar.abbrev}
                className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="clip-octagon flex h-8 w-8 items-center justify-center bg-voraz-black font-display text-[10px] font-bold text-voraz-white">
                    {pillar.abbrev}
                  </span>
                  <h3 className="font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
                    {pillar.title}
                  </h3>
                </div>
                <p className="mb-4 text-[11px] text-voraz-gray-400">{pillar.note}</p>
                <div className="space-y-2.5">
                  {pillar.rows.map((row) => (
                    <div key={row.label} className="flex items-center gap-4">
                      <span
                        className={`w-24 shrink-0 rounded-full px-2.5 py-1 text-center text-[11px] font-bold ${
                          row.color === "red"
                            ? "bg-voraz-red/10 text-voraz-red"
                            : row.color === "amber"
                              ? "bg-voraz-gold/10 text-voraz-gold"
                              : "bg-voraz-gray-100 text-voraz-gray-600"
                        }`}
                      >
                        {row.label}
                      </span>
                      <span className="text-sm text-voraz-gray-600">
                        {row.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Viabilidad con IA */}
        <section>
          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
            Viabilidad del plan (evaluación IA)
          </span>
          <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
            <p className="mb-4 text-sm leading-relaxed text-voraz-gray-600">
              Además de verificar si existe el plan, usamos GPT (OpenAI) para evaluar su viabilidad de forma objetiva. Este análisis indica qué tan realista y alcanzable es el plan propuesto basándose en criterios técnicos comprobables.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-display text-xs font-bold uppercase tracking-tight text-voraz-black">
                  Criterios de evaluación (evaluados por GPT)
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: "Especificidad", desc: "¿El plan describe acciones concretas o es muy vago?" },
                    { label: "Viabilidad fiscal", desc: "¿Es financieramente sostenible?" },
                    { label: "Capacidad institucional", desc: "¿Las instituciones pueden ejecutarlo?" },
                    { label: "Precedentes", desc: "¿Hay casos similares exitosos?" },
                    { label: "Coherencia", desc: "¿Es consistente con otras propuestas?" },
                  ].map((c) => (
                    <li key={c.label} className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-voraz-red" />
                      <div>
                        <span className="text-[11px] font-bold text-voraz-black">{c.label}</span>
                        <p className="text-[12px] text-voraz-gray-500">{c.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-voraz-gray-200 pt-4">
                <p className="text-[12px] leading-relaxed text-voraz-gray-500">
                  GPT evalúa cada criterio de 0 a 10, y se promedian para obtener la viabilidad general. Esta evaluación es <strong>indicativa y aproximada</strong>, basada en análisis de fuentes públicas. No representa una opinión editorial ni sustituye el análisis independiente del lector.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tecnología */}
        <section>
          <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
            Tecnología
          </span>
          <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
            <p className="mb-4 text-sm leading-relaxed text-voraz-gray-600">
              Este sitio fue construido con asistencia de IA y usa IA para dos funciones específicas:
            </p>
            <div className="space-y-4">
              {[
                {
                  label: "Viabilidad del plan",
                  desc: "GPT (OpenAI) evalúa los planes de gobierno registrados ante el JNE en base a 5 criterios técnicos. Es una evaluación indicativa, no editorial.",
                },
                {
                  label: "Contexto público",
                  desc: "GPT busca en la web artículos de medios reconocidos (El Comercio, RPP, La República, etc.) para complementar las declaraciones ante el JNE. Cada contexto incluye la fuente y un enlace verificado al artículo original.",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-voraz-gray-100 font-display text-[10px] font-bold text-voraz-black">
                    IA
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-voraz-black">{item.label}</span>
                    <p className="text-[12px] leading-relaxed text-voraz-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-voraz-gray-200 pt-4">
              <p className="text-[12px] leading-relaxed text-voraz-gray-500">
                El desarrollo del sitio fue asistido por{" "}
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-voraz-red hover:underline">
                  Claude Code
                </a>{" "}
                (Anthropic). Las evaluaciones de IA usan la API de{" "}
                <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="text-voraz-red hover:underline">
                  OpenAI
                </a>
                . Todo el contenido generado por IA está claramente marcado con la etiqueta{" "}
                <span className="rounded bg-voraz-gray-200 px-1 py-0.5 text-[8px] font-bold text-voraz-gray-500">
                  IA
                </span>{" "}
                en la interfaz.
              </p>
            </div>
          </div>
        </section>

        {/* Aviso legal */}
        <section className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-soft)]">
          <div className="border-l-2 border-voraz-red/30 pl-4">
            <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-voraz-gray-400">
              Aviso legal
            </h2>
            <p className="text-xs leading-relaxed text-voraz-gray-500">
              Este sitio es una herramienta informativa que organiza información
              de fuentes públicas oficiales. No constituye asesoría legal, no
              realiza acusaciones, no afirma culpabilidad y no reemplaza el
              criterio independiente del lector. Toda la información proviene de
              registros públicos (JNE, SUNEDU, Poder Judicial) y puede contener
              errores o estar desactualizada. Invitamos al usuario a verificar
              siempre las fuentes originales. Cualquier error reportado será
              corregido públicamente.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
