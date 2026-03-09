import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import StickyBar from "@/components/StickyBar";

export default function Home() {
  return (
    <>
      {/* Hero — dark background */}
      <div className="bg-voraz-black">
        <div className="mx-auto max-w-4xl px-6 pb-10 pt-10 sm:pt-16 lg:max-w-6xl">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              {/* Overline */}
              <div className="mb-4 animate-fade-in">
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-voraz-red">
                  <span className="mr-1.5" aria-label="Perú">🔴</span>
                  Elecciones 2026
                </span>
              </div>

              {/* Headline — observed by StickyBar */}
              <h1
                id="hero-title"
                className="animate-hero-reveal font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Los octógonos
                <br />
                de los candidatos
                <br />
                x VORAZ
              </h1>

              {/* Subtitle — VORAZ marketing copy */}
              <div className="mt-5 max-w-lg space-y-3 text-sm leading-relaxed text-white/70 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <p>
                  En Voraz sabemos lo importante que es vivir sin octógonos.
                </p>
                <p>
                  Por eso en estas elecciones presidenciales, decidimos ayudarte a identificar a aquellos candidatos que sí podrían tenerlos.
                </p>
                <p>
                  Usando data oficial y fuentes verificables, desarrollamos una plataforma con inteligencia artificial para analizar a todos los candidatos presidenciales, informando, bajo la figura de los octógonos, su nivel de educación, alertas legales y viabilidad real de sus planes de gobierno.
                </p>
                <p className="font-bold text-white">
                  Porque si algo tiene octógonos todos tenemos el derecho de saberlo.
                </p>
              </div>

              {/* Badge */}
              <div className="mt-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-voraz-red opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-voraz-red" />
                  </span>
                  IA + Fuentes públicas oficiales
                </div>
              </div>
            </div>

            {/* Hero image — VORAZ bags (big!) */}
            <div className="hidden shrink-0 animate-fade-in sm:block" style={{ animationDelay: "300ms" }}>
              <Image
                src="/hero-voraz.png"
                alt="VORAZ - Devora y vota sin culpa"
                width={400}
                height={400}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky title bar — appears when hero scrolls out */}
      <StickyBar observeId="hero-title">
        <div className="border-b border-white/10 bg-voraz-black/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-2.5 lg:max-w-6xl">
            <span className="font-display text-sm font-bold uppercase tracking-tight text-white">
              Los octógonos de los candidatos <span className="text-voraz-red">x VORAZ</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-voraz-red">
              🇵🇪 Elecciones 2026
            </span>
          </div>
        </div>
      </StickyBar>

      {/* Search section */}
      <div className="mx-auto max-w-4xl px-6 lg:max-w-6xl">
        <div className="mb-8 pt-8">
          <div className="mb-4">
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Explorar candidatos
            </span>
          </div>
          <SearchBar />
        </div>
      </div>

      {/* How octógonos work — full-bleed dark section */}
      <div className="animate-fade-in bg-voraz-black" style={{ animationDelay: "500ms" }}>
        <div className="mx-auto max-w-4xl px-6 py-10 sm:py-12 lg:max-w-6xl">
          <a href="/metodologia" className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-400 transition-colors hover:text-voraz-red">
            ¿Cómo funciona?
          </a>

          <p className="mt-4 mb-6 text-sm leading-relaxed text-white/80">
            Cada candidato tiene <strong className="text-white">3 octógonos</strong> que resumen lo más importante de su perfil.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                abbrev: "EDU",
                title: "Octógono Educación",
                desc: "¿Qué estudió? Títulos y grados verificados.",
              },
              {
                abbrev: "LEG",
                title: "Octógono Legal",
                desc: "¿Tiene problemas legales? Procesos y alertas.",
              },
              {
                abbrev: "PLAN",
                title: "Octógono Viabilidad",
                desc: "¿Qué propone? Plan de gobierno evaluado por IA.",
              },
            ].map((p) => (
              <div
                key={p.abbrev}
                className="flex items-start gap-3 rounded-xl bg-voraz-red/90 p-4"
              >
                <span className="clip-octagon flex h-9 w-9 shrink-0 items-center justify-center bg-white/20 font-display text-[9px] font-black text-white">
                  {p.abbrev}
                </span>
                <div>
                  <span className="font-display text-xs font-bold uppercase tracking-wide text-white">
                    {p.title}
                  </span>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/70">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center">
            <a href="/metodologia" className="text-[11px] text-white/50 underline transition-colors hover:text-voraz-red">
              Ver fuentes y metodología →
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
