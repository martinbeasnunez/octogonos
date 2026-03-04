import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  candidates,
  getCandidateBySlug,
  getDisplayLabel,
  getScoreDescription,
  getBadgeColor,
  getFeasibility,
  type PillarType,
  type ScoreLevel,
  type FeasibilityScore,
  type PublicContext,
} from "@/data/candidates";
import OctagonSeal from "@/components/OctagonSeal";
import StickyBar from "@/components/StickyBar";
import CandidateTracker from "@/components/CandidateTracker";
import type { Metadata } from "next";

export function generateStaticParams() {
  return candidates.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const candidate = getCandidateBySlug(slug);
  if (!candidate) return { title: "Candidato no encontrado" };
  return {
    title: `${candidate.name} — Octógonos`,
    description: `Octógonos de ${candidate.name} (${candidate.party}): educación, situación legal y plan de gobierno.`,
  };
}

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const candidate = getCandidateBySlug(slug);
  if (!candidate) notFound();

  const feasibility = getFeasibility(candidate.slug);

  // Filter out "Resumen del plan" PDFs (link to incorrect documents)
  const filterBrokenSources = (sources: { title: string; url: string }[]) =>
    sources.filter((s) => !s.title.toLowerCase().includes("resumen del plan"));

  const planSources = filterBrokenSources(candidate.plan.sources);

  const allSources = [
    ...candidate.education.sources,
    ...candidate.legal.sources,
    ...planSources,
  ];

  // Deduplicate sources by URL
  const uniqueSources = allSources.filter(
    (s, i, arr) => arr.findIndex((x) => x.url === s.url) === i
  );

  return (
    <div>
      <CandidateTracker slug={candidate.slug} name={candidate.name} />
      {/* Candidate header */}
      <div className="mx-auto max-w-4xl px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-voraz-gray-400 transition-colors hover:text-voraz-black sm:mb-8"
        >
          <span className="transition-transform duration-200 hover:-translate-x-0.5">←</span>
          Todos los candidatos
        </Link>

        <div id="candidate-name" className="flex items-start gap-5 animate-hero-reveal sm:gap-6">
          <Image
            src={`/photos/${candidate.slug}.jpg`}
            alt={candidate.name}
            width={96}
            height={96}
            className="h-20 w-20 shrink-0 rounded-full object-cover bg-voraz-gray-100 shadow-[var(--shadow-card)] sm:h-24 sm:w-24"
          />
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-voraz-black sm:text-5xl lg:text-6xl">
              {candidate.name}
            </h1>
            <div className="my-3 h-1 w-12 bg-voraz-red sm:my-4" />
            <p className="text-sm tracking-wide text-voraz-gray-500">
              {candidate.party}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky candidate bar — appears when name scrolls out */}
      <StickyBar observeId="candidate-name">
        <div className="border-b border-voraz-gray-100 bg-voraz-cream/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-2">
            <Link
              href="/"
              className="shrink-0 text-voraz-gray-400 transition-colors hover:text-voraz-black"
            >
              ←
            </Link>
            <Image
              src={`/photos/${candidate.slug}.jpg`}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-full object-cover bg-voraz-gray-100"
            />
            <span className="truncate font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
              {candidate.name}
            </span>
            <span className="hidden shrink-0 text-[10px] text-voraz-gray-400 sm:inline">
              {candidate.party}
            </span>
          </div>
        </div>
      </StickyBar>

      {/* Dark band — Octógonos */}
      <div className="bg-voraz-dark py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-500">
              Octógonos
            </span>
          </div>
          <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-14">
            <div className="animate-scale-in" style={{ animationDelay: "100ms" }}>
              <OctagonSeal
                pillar="education"
                score={candidate.education.score}
                explanation={candidate.education.explanation}
                darkBg
                hasContext={!!candidate.education.context}
              />
            </div>
            <div className="animate-scale-in" style={{ animationDelay: "250ms" }}>
              <OctagonSeal
                pillar="legal"
                score={candidate.legal.score}
                explanation={candidate.legal.explanation}
                darkBg
                hasContext={!!candidate.legal.context}
              />
            </div>
            <div className="animate-scale-in" style={{ animationDelay: "400ms" }}>
              <OctagonSeal
                pillar="plan"
                score={candidate.plan.score}
                explanation={candidate.plan.explanation}
                darkBg
                feasibilityScore={feasibility?.promedio}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detail section */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Section label */}
        <div className="mb-8">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
            Detalle por pilar
          </span>
        </div>

        <div className="mb-16 space-y-6">
          <div id="pillar-education" className="scroll-mt-20">
            <PillarDetail
              pillar="education"
              title="Educación"
              score={candidate.education.score}
              explanation={candidate.education.explanation}
              sources={candidate.education.sources}
              context={candidate.education.context}
              disclaimer="Según declaración jurada ante el JNE. Verificar grado en SUNEDU."
            />
          </div>
          <div id="pillar-legal" className="scroll-mt-20">
            <PillarDetail
              pillar="legal"
              title="Situación Legal"
              score={candidate.legal.score}
              explanation={candidate.legal.explanation}
              sources={candidate.legal.sources}
              context={candidate.legal.context}
              disclaimer="Según declaración jurada y registros públicos. No afirmamos culpabilidad."
            />
          </div>
          <div id="pillar-plan" className="scroll-mt-20">
            <PillarDetail
              pillar="plan"
              title="Plan de Gobierno"
              score={candidate.plan.score}
              explanation={candidate.plan.explanation}
              sources={planSources}
              feasibility={feasibility}
            />
          </div>
        </div>

        {/* Fuentes */}
        <section className="mb-12">
          <div className="mb-6">
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
              Fuentes
            </span>
          </div>
          <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
            <ol className="space-y-3">
              {uniqueSources.map((source, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-voraz-gray-100 text-[10px] font-bold text-voraz-gray-500">
                    {i + 1}
                  </span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-voraz-gray-700 transition-colors hover:text-voraz-red"
                  >
                    {source.title}
                    <span className="ml-1 text-voraz-gray-400">↗</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Report */}
        <div className="mb-12 text-center">
          <Link
            href="/correcciones"
            className="inline-flex items-center gap-2 rounded-full bg-voraz-white px-5 py-2.5 text-sm font-medium text-voraz-gray-600 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] hover:text-voraz-red"
          >
            Reportar error
          </Link>
        </div>

        {/* Microcopy */}
        <p className="text-center text-[11px] text-voraz-gray-400">
          Información de fuentes públicas oficiales. Siempre revisa los links.
        </p>
      </div>
    </div>
  );
}

function PillarDetail({
  pillar,
  title,
  subtitle,
  score,
  explanation,
  sources,
  disclaimer,
  feasibility,
  context,
}: {
  pillar: PillarType;
  title: string;
  subtitle?: string;
  score: ScoreLevel;
  explanation: string;
  sources: { title: string; url: string }[];
  disclaimer?: string;
  feasibility?: FeasibilityScore;
  context?: PublicContext;
}) {
  const label = getDisplayLabel(pillar, score);
  const scoreDesc = getScoreDescription(pillar, score);
  const badgeColor = getBadgeColor(pillar, score);

  // Solo resaltar en rojo legal/plan con score Alto (dato relevante, no juicio)
  const showAlert = score === "Alto" && pillar !== "education";

  const barColor = (val: number) => {
    if (val >= 7) return "bg-score-bajo";
    if (val >= 5) return "bg-voraz-gold";
    return "bg-voraz-red";
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-voraz-white p-4 shadow-[var(--shadow-card)] sm:p-6 ${
        showAlert ? "ring-1 ring-voraz-red/10" : ""
      }`}
    >
      {/* Top gradient accent for alert items */}
      {showAlert && (
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-voraz-red via-voraz-red/80 to-voraz-red/40" />
      )}

      <div className="mb-1 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold uppercase tracking-tight text-voraz-black">
            {title}
          </h3>
          {subtitle && (
            <span className="text-xs text-voraz-gray-400">{subtitle}</span>
          )}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${badgeColor}`}
        >
          {label}
        </span>
      </div>

      {/* What the score means */}
      <p className="mb-3 text-xs font-medium text-voraz-gray-400">
        {scoreDesc}
      </p>

      <p className="mb-4 text-sm leading-relaxed text-voraz-gray-600">
        {explanation}
      </p>

      {/* AI-generated public context with source */}
      {context && (
        <div className="mb-4 rounded-lg bg-voraz-gray-50 px-3 py-2.5">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-voraz-gray-400">
              Contexto público
            </span>
            <span className="rounded bg-voraz-gray-200 px-1 py-0.5 text-[8px] font-bold text-voraz-gray-500">
              IA
            </span>
          </div>
          <p className="text-xs leading-relaxed text-voraz-gray-600">
            {context.text}
          </p>
          <p className="mt-1.5 text-[10px] text-voraz-gray-400">
            Fuente:{" "}
            {context.sourceUrl ? (
              <a
                href={context.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-voraz-red"
              >
                {context.source} ↗
              </a>
            ) : (
              <span>{context.source}</span>
            )}
          </p>
        </div>
      )}

      {disclaimer && (
        <div className="mb-4 border-l-2 border-voraz-gray-200 pl-3">
          <p className="text-xs leading-relaxed text-voraz-gray-400">
            {disclaimer}
          </p>
        </div>
      )}

      {/* Feasibility section — inline within Plan de Gobierno */}
      {feasibility && (
        <div className="mb-4 border-t border-voraz-gray-100 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
                Viabilidad
              </h4>
              <span className="text-[10px] text-voraz-gray-400">Evaluado con IA — basado en fuentes</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="rounded-full bg-voraz-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-voraz-gray-700">
                {feasibility.promedio}/10
              </span>
              <span className="mt-0.5 text-[9px] text-voraz-gray-400">aproximado</span>
            </div>
          </div>

          <p className="mb-3 text-sm leading-relaxed text-voraz-gray-600">
            {feasibility.resumen}
          </p>

          <div className="space-y-2">
            {([
              { key: "especificidad" as const, label: "Especificidad" },
              { key: "viabilidadFiscal" as const, label: "Viabilidad fiscal" },
              { key: "capacidadInstitucional" as const, label: "Capacidad institucional" },
              { key: "precedentes" as const, label: "Precedentes" },
              { key: "coherencia" as const, label: "Coherencia" },
            ]).map(({ key, label: barLabel }) => {
              const val = feasibility[key];
              return (
                <div key={key}>
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-voraz-gray-500">{barLabel}</span>
                    <span className="text-[11px] font-bold text-voraz-gray-600">{val}/10</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-voraz-gray-100">
                    <div
                      className={`h-full rounded-full ${barColor(val)}`}
                      style={{ width: `${val * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-[10px] leading-relaxed text-voraz-gray-400">
            Análisis indicativo generado por IA a partir del plan oficial registrado ante el JNE. Resultados aproximados. No representa una opinión editorial.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-voraz-gray-50 px-3 py-1.5 text-[11px] font-medium text-voraz-gray-500 transition-colors hover:bg-voraz-red/10 hover:text-voraz-red"
          >
            {s.title} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
