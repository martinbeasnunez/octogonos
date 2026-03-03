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
}

export default function OctagonSeal({
  pillar,
  score,
  explanation,
  darkBg = false,
}: OctagonSealProps) {
  const pillarInfo = pillarLabels[pillar];
  const displayLabel = getDisplayLabel(pillar, score);
  const scoreDesc = getScoreDescription(pillar, score);
  const isAlto = score === "Alto";
  const isNeutro = displayLabel === "NEUTRO";

  // Semáforo: rojo para alto, naranja para neutro, blanco para el resto
  const labelColor = isAlto
    ? "text-voraz-red"
    : isNeutro
      ? "text-score-neutro"
      : "text-voraz-white";

  const ringColor = isAlto
    ? "bg-gradient-to-br from-voraz-red via-voraz-red/80 to-voraz-red/60"
    : isNeutro
      ? "bg-gradient-to-br from-score-neutro via-score-neutro/80 to-score-neutro/60"
      : "bg-voraz-gray-200";

  const glowColor = isAlto
    ? "bg-voraz-red/15 opacity-100"
    : isNeutro
      ? "bg-score-neutro/15 opacity-80"
      : "bg-voraz-black/10 opacity-50";

  return (
    <a
      href={`#pillar-${pillar}`}
      className="flex w-48 flex-col items-center gap-5 sm:w-56 group/seal cursor-pointer"
    >
      {/* Octagon container with hover effects */}
      <div
        className={`group relative flex h-36 w-36 items-center justify-center transition-transform duration-500 ease-out group-hover/seal:scale-105 sm:h-44 sm:w-44 ${
          isAlto ? "animate-seal-pulse" : ""
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

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-0.5 px-4 text-center">
          <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/25 sm:text-[11px]">
            {pillarInfo.abbrev}
          </span>
          <div className="my-1 h-px w-8 bg-white/15" />
          <span
            className={`font-display text-xl font-black tracking-tight sm:text-2xl ${labelColor}`}
          >
            {displayLabel}
          </span>
          <span className="mt-0.5 font-display text-[8px] font-bold uppercase tracking-[0.15em] text-white/35 sm:text-[9px]">
            {pillarInfo.title}
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
          {pillarInfo.title}
        </span>
        <p
          className={`text-[13px] font-medium leading-snug ${
            darkBg ? "text-voraz-gray-300" : "text-voraz-gray-600"
          }`}
        >
          {scoreDesc}
        </p>
      </div>
    </a>
  );
}
