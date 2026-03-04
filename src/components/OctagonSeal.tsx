import {
  getDisplayLabel,
  getScoreDescription,
  type PillarType,
  type ScoreLevel,
} from "@/data/candidates";

const pillarLabels: Record<PillarType, string> = {
  education: "EDUCACIÓN",
  legal: "LEGAL",
  plan: "VIABILIDAD",
};

interface OctagonSealProps {
  pillar: PillarType;
  score: ScoreLevel;
  explanation: string;
  darkBg?: boolean;
  feasibilityScore?: number;
  hasContext?: boolean;
}

export default function OctagonSeal({
  pillar,
  score,
  explanation,
  darkBg = false,
  feasibilityScore,
  hasContext = false,
}: OctagonSealProps) {
  const pillarTitle = pillarLabels[pillar];
  const displayLabel = getDisplayLabel(pillar, score);
  const scoreDesc = getScoreDescription(pillar, score);

  // For plan pillar with feasibility, show the score instead of label
  const showFeasibility = pillar === "plan" && feasibilityScore !== undefined;

  // Color por pilar — contexto público sube a ámbar si el nivel es neutral
  const colorLevel = (() => {
    if (score === "Alto") return "red" as const;
    if (score === "Medio") return "amber" as const;
    if (hasContext) return "amber" as const;
    return "neutral" as const;
  })();

  const labelColor = colorLevel === "red"
    ? "text-voraz-red"
    : colorLevel === "amber"
      ? "text-score-neutro"
      : "text-voraz-white";

  const ringColor = colorLevel === "red"
    ? "bg-gradient-to-br from-voraz-red via-voraz-red/80 to-voraz-red/60"
    : colorLevel === "amber"
      ? "bg-gradient-to-br from-score-neutro via-score-neutro/80 to-score-neutro/60"
      : "bg-voraz-gray-200";

  const glowColor = colorLevel === "red"
    ? "bg-voraz-red/15 opacity-100"
    : colorLevel === "amber"
      ? "bg-score-neutro/15 opacity-80"
      : "bg-voraz-black/10 opacity-50";

  // Solo pulsa en legal con sentencias
  const shouldPulse = pillar === "legal" && score === "Alto";

  return (
    <a
      href={`#pillar-${pillar}`}
      className="flex w-48 flex-col items-center gap-4 sm:w-56 group/seal cursor-pointer"
    >
      {/* Octagon */}
      <div
        className={`group relative flex h-36 w-36 items-center justify-center transition-transform duration-500 ease-out group-hover/seal:scale-105 sm:h-44 sm:w-44 ${
          shouldPulse ? "animate-seal-pulse" : ""
        }`}
      >
        {/* Glow */}
        <div
          className={`clip-octagon absolute inset-0 blur-xl transition-opacity duration-500 ${glowColor} group-hover:opacity-100`}
        />

        {/* Ring */}
        <div className={`clip-octagon absolute inset-0 ${ringColor}`} />

        {/* Body */}
        <div className="clip-octagon absolute inset-[5px] bg-voraz-black" />

        {/* Inner glow */}
        <div className="clip-octagon absolute inset-[5px] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

        {/* Context indicator */}
        {hasContext && (
          <div className="absolute -right-1 -top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-voraz-gold shadow-lg" title="Hay contexto público notable">
            <span className="text-[9px] font-black text-voraz-black">!</span>
          </div>
        )}

        {/* Content — clean layout: pillar name + score */}
        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          <span className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 sm:text-[10px]">
            {pillarTitle}
          </span>
          <div className="my-1.5 h-px w-8 bg-white/15" />
          {showFeasibility ? (
            <div className="flex items-baseline gap-0.5">
              <span className={`font-display text-3xl font-black tracking-tight sm:text-4xl ${labelColor}`}>
                {feasibilityScore}
              </span>
              <span className="font-display text-sm font-bold text-white/30">
                /10
              </span>
            </div>
          ) : (
            <span
              className={`font-display text-lg font-black leading-tight tracking-tight sm:text-xl ${labelColor}`}
            >
              {displayLabel}
            </span>
          )}
        </div>
      </div>

      {/* Description below */}
      <p
        className={`text-center text-[12px] font-medium leading-snug ${
          darkBg ? "text-voraz-gray-400" : "text-voraz-gray-500"
        }`}
      >
        {showFeasibility ? "Evaluación IA — aproximado" : scoreDesc}
      </p>
    </a>
  );
}
