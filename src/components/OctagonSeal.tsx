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

  // Semáforo: verde (bueno), ámbar (medio/contexto), rojo (alto)
  const colorLevel = (() => {
    if (score === "Alto") return "red" as const;
    if (score === "Medio") return "amber" as const;
    if (hasContext) return "amber" as const;
    return "green" as const;
  })();

  // Colores del label central (score/resultado)
  const labelColor =
    colorLevel === "red"
      ? "text-voraz-red"
      : colorLevel === "amber"
        ? "text-score-neutro"
        : "text-score-bajo";

  // Colores del anillo octagonal
  const ringColor =
    colorLevel === "red"
      ? "bg-gradient-to-br from-voraz-red via-voraz-red/80 to-voraz-red/60"
      : colorLevel === "amber"
        ? "bg-gradient-to-br from-score-neutro via-score-neutro/80 to-score-neutro/60"
        : "bg-gradient-to-br from-score-bajo via-score-bajo/70 to-score-bajo/50";

  // Glow exterior
  const glowColor =
    colorLevel === "red"
      ? "bg-voraz-red/20 opacity-100"
      : colorLevel === "amber"
        ? "bg-score-neutro/15 opacity-80"
        : "bg-score-bajo/12 opacity-70";

  // Pillar name = blanco sobre fondo negro (como octógonos reales peruanos)
  const pillarNameColor = "text-white/80";

  // Divider
  const dividerColor = "bg-white/25";

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

        {/* Body — negro como los octógonos reales peruanos */}
        <div className="clip-octagon absolute inset-[5px] bg-voraz-black" />

        {/* Inner glow */}
        <div className="clip-octagon absolute inset-[5px] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

        {/* Context indicator */}
        {hasContext && (
          <div className="absolute -right-1 -top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-voraz-gold shadow-lg" title="Hay contexto público notable">
            <span className="text-[9px] font-black text-voraz-black">!</span>
          </div>
        )}

        {/* Content — pillar name prominent + score below */}
        <div className="relative z-10 flex flex-col items-center px-3 text-center">
          <span className={`font-display text-xs font-black uppercase tracking-[0.15em] sm:text-sm ${pillarNameColor}`}>
            {pillarTitle}
          </span>
          <div className={`my-2 h-px w-12 sm:w-14 ${dividerColor}`} />
          {showFeasibility ? (
            <div className="flex items-baseline gap-0.5">
              <span className={`font-display text-3xl font-black tracking-tight sm:text-4xl ${labelColor}`}>
                {feasibilityScore}
              </span>
              <span className="font-display text-sm font-bold text-white/40">
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
