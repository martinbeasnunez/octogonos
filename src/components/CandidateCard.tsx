import Image from "next/image";
import Link from "next/link";
import {
  getDisplayLabel,
  getBadgeColor,
  getFeasibility,
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
}: {
  pillar: PillarType;
  score: ScoreLevel;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getBadgeColor(pillar, score)}`}
    >
      <span className="opacity-50">{pillarShort[pillar]}</span>
      {getDisplayLabel(pillar, score)}
    </span>
  );
}

export default function CandidateCard({
  candidate,
}: {
  candidate: Candidate;
}) {
  const hasAlto =
    candidate.education.score === "Alto" ||
    candidate.legal.score === "Alto" ||
    candidate.plan.score === "Alto";

  const feasibility = getFeasibility(candidate.slug);

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
      className={`group relative block overflow-hidden rounded-xl bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${
        hasAlto ? "ring-1 ring-voraz-red/10" : ""
      }`}
    >
      {hasAlto && (
        <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-voraz-red to-voraz-red/30" />
      )}

      <div className="mb-3 flex items-center gap-3">
        <Image
          src={`/photos/${candidate.slug}.jpg`}
          alt={candidate.name}
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-full object-cover bg-voraz-gray-100"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg font-bold uppercase leading-tight tracking-tight text-voraz-black transition-colors group-hover:text-voraz-red">
            {candidate.name}
          </h3>
          <p className="mt-0.5 truncate text-xs tracking-wide text-voraz-gray-500">
            {candidate.party}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <PillarBadge pillar="education" score={candidate.education.score} />
        <PillarBadge pillar="legal" score={candidate.legal.score} />
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
