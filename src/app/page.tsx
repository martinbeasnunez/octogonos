import SearchBar from "@/components/SearchBar";
import StickyBar from "@/components/StickyBar";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:max-w-6xl">
      {/* Hero */}
      <div className="pb-8 pt-10 sm:pt-16">
        {/* Overline */}
        <div className="mb-4 animate-fade-in">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-voraz-red">
            Elecciones 2026
          </span>
        </div>

        {/* Headline — observed by StickyBar */}
        <h1
          id="hero-title"
          className="animate-hero-reveal font-display text-4xl font-black uppercase leading-[0.9] tracking-tight text-voraz-black sm:text-6xl lg:text-7xl"
        >
          Octógonos
          <br />
          <span className="text-voraz-gray-400">de candidatos</span>
          <br />
          <span className="text-voraz-red">+ IA</span>
        </h1>

        {/* Red editorial rule */}
        <div className="my-5 h-1 w-16 bg-voraz-red animate-fade-in" style={{ animationDelay: "200ms" }} />

        {/* Subtitle */}
        <p className="max-w-lg text-base leading-relaxed text-voraz-gray-600 animate-fade-in" style={{ animationDelay: "300ms" }}>
          Toda la info de cada candidato presidencial en un solo lugar. Educación, historial legal y plan de gobierno — con fuentes oficiales.
        </p>

        {/* Badge */}
        <div className="mt-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-voraz-white px-3 py-1.5 text-[11px] font-medium text-voraz-gray-600 shadow-[var(--shadow-soft)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-voraz-red opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-voraz-red" />
            </span>
            IA + fuentes públicas oficiales
          </div>
        </div>
      </div>

      {/* Sticky title bar — appears when hero scrolls out */}
      <StickyBar observeId="hero-title">
        <div className="border-b border-voraz-gray-100 bg-voraz-cream/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-2.5">
            <span className="font-display text-sm font-bold uppercase tracking-tight text-voraz-black">
              Octógonos de candidatos
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-voraz-red">
              Elecciones 2026
            </span>
          </div>
        </div>
      </StickyBar>

      {/* Search section */}
      <div className="mb-8">
        <div className="mb-4">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400">
            Explorar candidatos
          </span>
        </div>
        <SearchBar />
      </div>

      {/* Pillar preview — compact, below candidates */}
      <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-3 animate-fade-in" style={{ animationDelay: "500ms" }}>
        {[
          { abbrev: "EDU", title: "Educación", desc: "¿Qué estudió?" },
          { abbrev: "LEG", title: "Sit. Legal", desc: "¿Tiene alertas legales?" },
          { abbrev: "PLAN", title: "Plan Gob.", desc: "¿Tiene plan de gobierno?" },
        ].map((p) => (
          <div
            key={p.abbrev}
            className="flex items-center gap-2.5 rounded-lg bg-voraz-white p-3 shadow-[var(--shadow-soft)]"
          >
            <span className="clip-octagon flex h-8 w-8 shrink-0 items-center justify-center bg-voraz-black font-display text-[9px] font-black text-voraz-white">
              {p.abbrev}
            </span>
            <div className="min-w-0">
              <span className="block font-display text-[11px] font-bold uppercase tracking-wide text-voraz-black">
                {p.title}
              </span>
              <span className="block text-[10px] leading-snug text-voraz-gray-400">
                {p.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Microcopy */}
      <p className="pb-8 text-center text-[11px] text-voraz-gray-400">
        Información de fuentes públicas oficiales. Siempre revisa los links.
      </p>
    </div>
  );
}
