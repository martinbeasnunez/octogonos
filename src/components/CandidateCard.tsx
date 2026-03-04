import Image from "next/image";
import Link from "next/link";
import {
  getDisplayLabel,
  getBadgeColor,
  getFeasibility,
  getPollPct,
  type Candidate,
  type PillarType,
  type ScoreLevel,
} from "@/data/candidates";

const pillarShort: Record<PillarType, string> = {
  education: "EDU",
  legal: "LEG",
  plan: "PLAN",
};

function PillarBadge({
  pillar,
  score,
  hasContext,
}: {
  pillar: PillarType;
  score: ScoreLevel;
  hasContext?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
        hasContext && pillar === "education"
          ? "bg-voraz-gold/10 text-voraz-gold"
          : getBadgeColor(pillar, score)
      }`}
    >
      <span className="opacity-50">{pillarShort[pillar]}</span>
      {getDisplayLabel(pillar, score)}
      {hasContext && (
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-voraz-gold text-[7px] font-black text-voraz-black">
          !
        </span>
      )}
    </span>
  );
}

export default function CandidateCard({
  candidate,
}: {
  candidate: Candidate;
}) {
  // Solo legal y plan activan alerta roja (educación es dato, no juicio)
  const hasAlert =
    candidate.legal.score === "Alto" ||
    candidate.plan.score === "Alto";

  const feasibility = getFeasibility(candidate.slug);
  const pollPct = getPollPct(candidate.slug);

  const feasColor = feasibility
    ? feasibility.promedio >= 6.5
      ? "text-score-bajo"
      : feasibility.promedio >= 5
        ? "text-voraz-gold"
        : "text-voraz-red"
    : "";

  return (
    <Link
      href={`/c/${candidate.slug}`}
      className={`group relative block overflow-hidden rounded-lg sm:rounded-xl bg-white p-4 sm:p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${
        hasAlert ? "ring-1 ring-voraz-red/10" : ""
      }`}
    >
      {hasAlert && (
        <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-voraz-red to-voraz-red/30" />
      )}

      <div className="mb-3 flex items-center gap-2 sm:gap-3">
        <Image
          src={`/photos/${candidate.slug}.jpg`}
          alt={candidate.name}
          width={48}
          height={48}
          className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full object-cover bg-voraz-gray-100"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-display text-base sm:text-lg font-bold uppercase leading-tight tracking-tight text-voraz-black transition-colors group-hover:text-voraz-red">
            {candidate.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-2">
            <p className="line-clamp-1 text-[11px] sm:text-xs tracking-wide text-voraz-gray-500">
              {candidate.party}
            </p>
            {pollPct !== undefined && (
              <span className="shrink-0 rounded bg-voraz-gray-100 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-voraz-gray-500">
                {pollPct}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <PillarBadge pillar="education" score={candidate.education.score} hasContext={!!candidate.education.context} />
        <PillarBadge pillar="legal" score={candidate.legal.score} hasContext={!!candidate.legal.context} />
        {feasibility ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getBadgeColor("plan", candidate.plan.score)}`}
          >
            <span className="opacity-50">PLAN</span>
            <span className={`font-black ${feasColor}`}>
              {feasibility.promedio}/10
            </span>
          </span>
        ) : (
          <PillarBadge pillar="plan" score={candidate.plan.score} />
        )}
      </div>
    </Link>
  );
}
