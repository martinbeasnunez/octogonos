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
                4
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
                desc: "¿Tiene plan de gobierno? Verificamos si el candidato registró un plan ante el JNE y si los documentos están disponibles para descargar.",
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
            Escala por pilar
          </span>
          <div className="space-y-6">
            {[
              {
                abbrev: "EDU",
                title: "Educación",
                rows: [
                  { label: "SÓLIDO", desc: "Tiene posgrado (maestría o doctorado).", isAlto: false },
                  { label: "MIXTO", desc: "Estudios universitarios completados.", isAlto: false },
                  { label: "DÉBIL", desc: "Educación técnica o básica declarada.", isAlto: true },
                ],
              },
              {
                abbrev: "LEG",
                title: "Situación Legal",
                rows: [
                  { label: "NEUTRO", desc: "Sin alertas en registros públicos.", isAlto: false },
                  { label: "MIXTO", desc: "Tiene anotaciones pendientes.", isAlto: false },
                  { label: "ALERTA", desc: "Declaró sentencia(s) ante el JNE.", isAlto: true },
                ],
              },
              {
                abbrev: "PLAN",
                title: "Plan de Gobierno",
                rows: [
                  { label: "REAL", desc: "Plan completo y resumen disponibles para descargar.", isAlto: false },
                  { label: "MIXTO", desc: "Plan parcialmente disponible.", isAlto: false },
                  { label: "ETÉREO", desc: "Sin plan de gobierno registrado.", isAlto: true },
                ],
              },
            ].map((pillar) => (
              <div
                key={pillar.abbrev}
                className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="clip-octagon flex h-8 w-8 items-center justify-center bg-voraz-black font-display text-[10px] font-bold text-voraz-white">
                    {pillar.abbrev}
                  </span>
                  <h3 className="font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
                    {pillar.title}
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {pillar.rows.map((row) => (
                    <div key={row.label} className="flex items-center gap-4">
                      <span
                        className={`w-20 shrink-0 rounded-full px-2.5 py-1 text-center text-[11px] font-bold ${
                          row.isAlto
                            ? "bg-voraz-red/10 text-voraz-red"
                            : "bg-voraz-black text-voraz-white"
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
