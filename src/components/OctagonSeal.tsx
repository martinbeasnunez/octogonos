import {
  getDisplayLabel,
  getScoreDescription,
  type PillarType,
  type ScoreLevel,
} from "@/data/candidates";

const pillarLabels: Record<PillarType, { title: string; abbrev: string }> = {
  education: { title: "EDUCACIÓN", abbrev: "EDU" },
  legal: { title: "SIT. LEGAL", abbrev: "LEG" },
  plan: { title: "PLAN GOB.", abbrev: "PLAN" },
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
  const pillarInfo = pillarLabels[pillar];
  const displayLabel = getDisplayLabel(pillar, score);
  const scoreDesc = getScoreDescription(pillar, score);

  // For plan pillar with feasibility, show the score instead of label
  const showFeasibility = pillar === "plan" && feasibilityScore !== undefined;

  // Color por pilar — contexto público sube a ámbar si el nivel es neutral
  // Ej: JNE dice "limpio" pero IA encontró investigación → ámbar
  const colorLevel = (() => {
    if (score === "Alto") return "red" as const;
    if (score === "Medio") return "amber" as const;
    // Neutral SALVO que tenga contexto público notable
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

  // Solo pulsa en legal con sentencias (dato relevante, no juicio)
  const shouldPulse = pillar === "legal" && score === "Alto";

  return (
    <a
      href={`#pillar-${pillar}`}
      className="flex w-48 flex-col items-center gap-5 sm:w-56 group/seal cursor-pointer"
    >
      {/* Octagon container with hover effects */}
      <div
        className={`group relative flex h-36 w-36 items-center justify-center transition-transform duration-500 ease-out group-hover/seal:scale-105 sm:h-44 sm:w-44 ${
          shouldPulse ? "animate-seal-pulse" : ""
        }`}
      >
        {/* Glow shadow layer */}
        <div
          className={`clip-octagon absolute inset-0 blur-xl transition-opacity duration-500 ${glowColor} group-hover:opacity-100`}
        />

        {/* Outer ring */}
        <div className={`clip-octagon absolute inset-0 ${ringColor}`} />

        {/* Black body */}
        <div className="clip-octagon absolute inset-[5px] bg-voraz-black" />

        {/* Inner radial glow for depth */}
        <div className="clip-octagon absolute inset-[5px] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

        {/* Context indicator — dot when AI found notable public info */}
        {hasContext && (
          <div className="absolute -right-1 -top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-voraz-gold shadow-lg" title="Hay contexto público notable">
            <span className="text-[9px] font-black text-voraz-black">!</span>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-0.5 px-4 text-center">
          <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/25 sm:text-[11px]">
            {pillarInfo.abbrev}
          </span>
          <div className="my-1 h-px w-8 bg-white/15" />
          {showFeasibility ? (
            <>
              <span className={`font-display text-2xl font-black tracking-tight sm:text-3xl ${labelColor}`}>
                {feasibilityScore}
              </span>
              <span className="font-display text-[9px] font-bold uppercase tracking-[0.1em] text-white/40 sm:text-[10px]">
                /10
              </span>
            </>
          ) : (
            <span
              className={`font-display text-xl font-black tracking-tight sm:text-2xl ${labelColor}`}
            >
              {displayLabel}
            </span>
          )}
          <span className="mt-0.5 font-display text-[8px] font-bold uppercase tracking-[0.15em] text-white/35 sm:text-[9px]">
            {showFeasibility ? "VIABILIDAD" : pillarInfo.title}
          </span>
        </div>
      </div>

      {/* Score meaning — what the label means */}
      <div className="w-full text-center">
        <span
          className={`mb-1 inline-block font-display text-[10px] font-bold uppercase tracking-[0.15em] ${
            darkBg ? "text-voraz-gray-500" : "text-voraz-gray-400"
          }`}
        >
          {showFeasibility ? "VIABILIDAD DEL PLAN" : pillarInfo.title}
        </span>
        <p
          className={`text-[13px] font-medium leading-snug ${
            darkBg ? "text-voraz-gray-300" : "text-voraz-gray-600"
          }`}
        >
          {showFeasibility ? "Evaluación IA — aproximado" : scoreDesc}
        </p>
      </div>
    </a>
  );
}
