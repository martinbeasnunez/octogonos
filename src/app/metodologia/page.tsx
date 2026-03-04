import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Metodología — Octógonos",
  description:
    "Cómo funciona Octógonos: organizamos información pública de candidatos presidenciales peruanos con IA para que votes informado.",
};

export default function MetodologiaPage() {
  return (
    <div>
      {/* Hero — dark band */}
      <div className="bg-voraz-dark">
        <div className="mx-auto max-w-4xl px-6 pb-12 pt-6 sm:pb-16 sm:pt-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-voraz-gray-500 transition-colors hover:text-voraz-cream sm:mb-10"
          >
            <span className="transition-transform duration-200 hover:-translate-x-0.5">←</span>
            Inicio
          </Link>

          <div className="animate-hero-reveal">
            <span className="mb-3 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-500">
              Metodología
            </span>
            <h1 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-voraz-white sm:text-5xl lg:text-6xl">
              Cómo funciona
              <br />
              <span className="text-voraz-red">Octógonos</span>
            </h1>
            <div className="mt-5 h-1 w-12 bg-voraz-red" />
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-voraz-gray-400 sm:text-base">
              Organizamos información pública de 36 candidatos presidenciales
              usando fuentes oficiales e inteligencia artificial. Todo
              verificable, todo con fuentes.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-10 sm:py-16">
        <div className="space-y-16">
          {/* ── Principios ── */}
          <section>
            <SectionLabel>Principios</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  num: "01",
                  title: "Solo fuentes oficiales",
                  desc: "Toda la información base proviene del JNE (Voto Informado) y SUNEDU. Incluimos los enlaces directos para que verifiques tú mismo.",
                },
                {
                  num: "02",
                  title: "Sin juicios de valor",
                  desc: "No hacemos acusaciones ni afirmamos culpabilidad. Mostramos lo que el candidato declaró en su hoja de vida, nada más.",
                },
                {
                  num: "03",
                  title: "IA transparente",
                  desc: "Todo contenido generado por IA está marcado. Cada contexto público incluye la fuente periodística y un enlace verificado al artículo original.",
                },
                {
                  num: "04",
                  title: "Correcciones públicas",
                  desc: "Si hay un error, lo corregimos públicamente. Cualquier persona puede reportar un error desde la página de cada candidato.",
                },
              ].map((p) => (
                <div
                  key={p.num}
                  className="rounded-2xl bg-voraz-white p-5 shadow-[var(--shadow-soft)]"
                >
                  <span className="font-display text-2xl font-black text-voraz-gray-200">
                    {p.num}
                  </span>
                  <h3 className="mt-1 font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-voraz-gray-500">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Los 3 Octógonos ── */}
          <section>
            <SectionLabel>Los 3 octógonos</SectionLabel>
            <p className="mb-6 text-sm leading-relaxed text-voraz-gray-600">
              Cada candidato tiene tres octógonos que resumen su perfil en
              dimensiones verificables. Los colores siguen un semáforo:{" "}
              <span className="font-bold text-score-bajo">verde</span> (sin alertas),{" "}
              <span className="font-bold text-voraz-gold">ámbar</span> (atención),{" "}
              <span className="font-bold text-voraz-red">rojo</span> (alerta).
              Los labels describen lo que el candidato declaró, no lo que opinamos.
            </p>

            <div className="space-y-4">
              {/* Education */}
              <PillarCard
                icon="EDUCACIÓN"
                title="Educación"
                subtitle="Según declaración jurada ante el JNE · Verificar en SUNEDU"
                description="Tomamos el nivel de instrucción que el candidato declaró ante el JNE. Cada ficha incluye enlace directo a su perfil en Voto Informado y a SUNEDU para verificar grados."
                rows={[
                  { label: "POSGRADO", desc: "Declaró posgrado (maestría o doctorado)", color: "green" },
                  { label: "PREGRADO", desc: "Declaró estudios universitarios", color: "amber" },
                  { label: "TÉCNICA", desc: "Declaró educación técnica o básica", color: "red" },
                ]}
                contextNote="Si la IA encuentra noticias sobre controversias académicas (plagios, grados cuestionados), el octágono se marca en ámbar con un indicador."
              />

              {/* Legal */}
              <PillarCard
                icon="LEGAL"
                title="Situación Legal"
                subtitle="Según declaración jurada ante el JNE"
                description="Revisamos lo que el candidato declaró en su hoja de vida ante el JNE. No hicimos scraping al Poder Judicial ni a otras bases — solo mostramos lo declarado."
                rows={[
                  { label: "NO REPORTA", desc: "No declaró problemas legales en su hoja de vida ante el JNE", color: "green" },
                  { label: "PROCESO", desc: "Declaró anotaciones o procesos pendientes", color: "amber" },
                  { label: "SENTENCIA", desc: "Declaró sentencia(s) en su hoja de vida", color: "red" },
                ]}
                contextNote="Si la IA encuentra investigaciones fiscales o procesos judiciales de alto perfil en medios, el octágono se marca en ámbar aunque el candidato no lo haya reportado."
              />

              {/* Plan */}
              <PillarCard
                icon="VIABILIDAD"
                title="Plan de Gobierno"
                subtitle="Registrado ante el JNE · Viabilidad evaluada con IA"
                description="Verificamos si el candidato registró plan ante el JNE y evaluamos su viabilidad con IA en 5 criterios técnicos, puntuados de 0 a 10."
                rows={[
                  { label: "COMPLETO", desc: "Plan registrado + viabilidad evaluada", color: "green" },
                  { label: "PARCIAL", desc: "Plan parcial o viabilidad con restricciones", color: "amber" },
                  { label: "SIN PLAN", desc: "Sin plan registrado o viabilidad muy baja", color: "red" },
                ]}
              />
            </div>
          </section>

          {/* ── Fuentes ── */}
          <section>
            <SectionLabel>Fuentes de datos</SectionLabel>
            <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
              <div className="space-y-5">
                {[
                  {
                    label: "JNE",
                    full: "Jurado Nacional de Elecciones",
                    desc: "Fuente principal. Hoja de vida, declaración jurada, fórmulas presidenciales y planes de gobierno vía Voto Informado.",
                    url: "https://votoinformado.jne.gob.pe",
                    primary: true,
                  },
                  {
                    label: "SUNEDU",
                    full: "Superintendencia Nacional de Educación",
                    desc: "Verificación de grados y títulos. Incluimos el enlace para que el lector consulte directamente.",
                    url: "https://enlinea.sunedu.gob.pe",
                    primary: true,
                  },
                  {
                    label: "MEDIOS",
                    full: "Medios de comunicación",
                    desc: "Para el contexto público generado por IA. Fuentes: El Comercio, RPP, La República, Gestión, BBC Mundo y otros. Cada contexto incluye enlace verificado.",
                    primary: false,
                  },
                ].map((s) => (
                  <div key={s.label} className="flex items-start gap-4">
                    <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-[10px] font-bold ${
                      s.primary
                        ? "bg-voraz-dark text-voraz-white"
                        : "bg-voraz-gray-100 text-voraz-gray-600"
                    }`}>
                      {s.label}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-voraz-black">{s.full}</span>
                        {s.primary && (
                          <span className="rounded bg-score-bajo/10 px-1.5 py-0.5 text-[8px] font-bold text-score-bajo">
                            FUENTE DIRECTA
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-voraz-gray-500">
                        {s.desc}
                      </p>
                      {s.url && (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-[11px] text-voraz-red hover:underline"
                        >
                          {s.url.replace("https://", "")} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Inteligencia artificial ── */}
          <section>
            <SectionLabel>Inteligencia artificial</SectionLabel>
            <p className="mb-6 text-sm leading-relaxed text-voraz-gray-600">
              Usamos IA en dos funciones específicas. Todo contenido generado
              está claramente marcado con{" "}
              <span className="rounded bg-voraz-gray-200 px-1 py-0.5 text-[8px] font-bold text-voraz-gray-500">
                IA
              </span>{" "}
              en la interfaz.
            </p>

            <div className="space-y-4">
              {/* AI Feature 1: Viabilidad */}
              <div className="overflow-hidden rounded-2xl bg-voraz-white shadow-[var(--shadow-card)]">
                <div className="border-l-4 border-voraz-red p-6">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
                      Viabilidad del plan
                    </h3>
                    <span className="rounded bg-voraz-gray-200 px-1.5 py-0.5 text-[8px] font-bold text-voraz-gray-500">
                      IA
                    </span>
                  </div>
                  <p className="mb-4 text-[13px] leading-relaxed text-voraz-gray-500">
                    GPT (OpenAI) evalúa los planes de gobierno registrados ante
                    el JNE en 5 criterios técnicos. Cada criterio se puntúa de 0
                    a 10 y se promedian.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-5">
                    {[
                      { label: "Especificidad", desc: "¿Acciones concretas o vagas?" },
                      { label: "Viab. fiscal", desc: "¿Es financieramente sostenible?" },
                      { label: "Cap. institucional", desc: "¿Las instituciones pueden ejecutarlo?" },
                      { label: "Precedentes", desc: "¿Hay casos similares exitosos?" },
                      { label: "Coherencia", desc: "¿Es internamente consistente?" },
                    ].map((c) => (
                      <div
                        key={c.label}
                        className="rounded-lg bg-voraz-gray-50 p-3 text-center"
                      >
                        <span className="block text-[10px] font-bold text-voraz-black">
                          {c.label}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-voraz-gray-400">
                          {c.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[11px] text-voraz-gray-400">
                    Modelo: GPT-4o (OpenAI) · Evaluación indicativa y aproximada · No representa opinión editorial
                  </p>
                </div>
              </div>

              {/* AI Feature 2: Contexto público */}
              <div className="overflow-hidden rounded-2xl bg-voraz-white shadow-[var(--shadow-card)]">
                <div className="border-l-4 border-voraz-gold p-6">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
                      Contexto público
                    </h3>
                    <span className="rounded bg-voraz-gray-200 px-1.5 py-0.5 text-[8px] font-bold text-voraz-gray-500">
                      IA
                    </span>
                  </div>
                  <p className="mb-4 text-[13px] leading-relaxed text-voraz-gray-500">
                    GPT busca en la web artículos de medios reconocidos que
                    complementen lo declarado ante el JNE. Solo incluye hechos
                    documentados con fuente verificable.
                  </p>
                  <div className="space-y-2">
                    {[
                      { bold: "Educación:", text: "controversias académicas, plagios, grados cuestionados" },
                      { bold: "Legal:", text: "investigaciones fiscales, condenas, procesos de alto perfil" },
                      { bold: "Cada contexto", text: "incluye nombre del medio y enlace al artículo original" },
                      { bold: "Si no hay nada notable,", text: "no se muestra contexto (la mayoría de candidatos)" },
                    ].map((item) => (
                      <div key={item.bold} className="flex items-start gap-3">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-voraz-gold" />
                        <span className="text-[12px] text-voraz-gray-500">
                          <strong className="text-voraz-black">{item.bold}</strong> {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[11px] text-voraz-gray-400">
                    Modelo: GPT-4o-mini + Web Search (OpenAI) · URLs verificadas (HTTP 200)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Encuestas ── */}
          <section>
            <SectionLabel>Datos de encuestas</SectionLabel>
            <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
              <p className="mb-3 text-sm leading-relaxed text-voraz-gray-600">
                El porcentaje que se muestra junto a cada candidato es un
                promedio de encuestas publicadas por las principales
                encuestadoras del país en medios nacionales.
              </p>
              <p className="text-[11px] text-voraz-gray-400">
                Datos actualizados periódicamente · No representa una predicción electoral
              </p>
            </div>
          </section>

          {/* ── Tecnología ── */}
          <section>
            <SectionLabel>Tecnología</SectionLabel>
            <div className="rounded-2xl bg-voraz-dark p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Desarrollo",
                    value: "Claude Code",
                    sub: "Anthropic",
                    url: "https://claude.ai",
                  },
                  {
                    label: "Evaluación IA",
                    value: "GPT-4o / 4o-mini",
                    sub: "OpenAI API",
                    url: "https://openai.com",
                  },
                  {
                    label: "Framework",
                    value: "Next.js",
                    sub: "React + Vercel",
                    url: "https://nextjs.org",
                  },
                ].map((t) => (
                  <a
                    key={t.label}
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl bg-voraz-black/50 p-4 transition-colors hover:bg-voraz-black/80"
                  >
                    <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-voraz-gray-500">
                      {t.label}
                    </span>
                    <span className="mt-1 block font-display text-sm font-bold text-voraz-white group-hover:text-voraz-red">
                      {t.value}
                    </span>
                    <span className="block text-[11px] text-voraz-gray-500">
                      {t.sub}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ── Aviso legal ── */}
          <section>
            <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-soft)]">
              <div className="border-l-2 border-voraz-red/30 pl-4">
                <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-voraz-gray-400">
                  Aviso legal
                </h2>
                <p className="text-xs leading-relaxed text-voraz-gray-500">
                  Este sitio es una herramienta informativa que organiza
                  información de fuentes públicas oficiales (JNE, SUNEDU) y
                  medios de comunicación. No constituye asesoría legal, no
                  realiza acusaciones, no afirma culpabilidad y no reemplaza el
                  criterio independiente del lector. La información puede
                  contener errores o estar desactualizada. Invitamos al usuario
                  a verificar siempre las fuentes originales. Cualquier error
                  reportado será{" "}
                  <Link href="/correcciones" className="text-voraz-red hover:underline">
                    corregido públicamente
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable components ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
        {children}
      </span>
      <div className="h-px flex-1 bg-voraz-gray-200" />
    </div>
  );
}

function PillarCard({
  icon,
  title,
  subtitle,
  description,
  rows,
  contextNote,
}: {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  rows: { label: string; desc: string; color: string }[];
  contextNote?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-voraz-white shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3 border-b border-voraz-gray-100 px-6 py-4">
        <span className="clip-octagon flex h-9 w-9 items-center justify-center bg-voraz-black font-display text-[7px] font-bold tracking-wider text-voraz-white">
          {icon.slice(0, 3)}
        </span>
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
            {title}
          </h3>
          <span className="text-[10px] text-voraz-gray-400">{subtitle}</span>
        </div>
      </div>
      <div className="p-6">
        <p className="mb-4 text-[13px] leading-relaxed text-voraz-gray-500">
          {description}
        </p>
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span
                className={`w-28 shrink-0 rounded-full px-2.5 py-1 text-center text-[11px] font-bold ${
                  row.color === "red"
                    ? "bg-voraz-red/10 text-voraz-red"
                    : row.color === "amber"
                      ? "bg-voraz-gold/10 text-voraz-gold"
                      : "bg-score-bajo/10 text-score-bajo"
                }`}
              >
                {row.label}
              </span>
              <span className="text-[12px] text-voraz-gray-500">
                {row.desc}
              </span>
            </div>
          ))}
        </div>
        {contextNote && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-voraz-gold/5 px-3 py-2">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-voraz-gold text-[8px] font-black text-voraz-black">
              !
            </span>
            <span className="text-[11px] leading-relaxed text-voraz-gray-500">
              {contextNote}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
