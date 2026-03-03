import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      {/* Gradient transition from cream to dark */}
      <div className="h-16 bg-gradient-to-b from-voraz-cream to-voraz-dark" />

      <div className="bg-voraz-dark">
        <div className="mx-auto max-w-4xl px-6 pb-10 pt-8">
          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-black uppercase tracking-[0.1em] text-voraz-white sm:text-lg">
                  Octógonos
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-voraz-red" />
              </div>
              <p className="mt-1 text-[10px] text-voraz-gray-500">
                powered by <span className="font-bold tracking-wider text-voraz-gray-400">VORAZ</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-voraz-gray-400">
                Información pública organizada por IA. No afirmamos culpabilidad.
              </p>
            </div>
            <nav className="flex gap-5 text-xs text-voraz-gray-400">
              <Link
                href="/metodologia"
                className="transition-colors hover:text-voraz-cream"
              >
                Metodología
              </Link>
              <Link
                href="/correcciones"
                className="transition-colors hover:text-voraz-cream"
              >
                Correcciones
              </Link>
            </nav>
          </div>

          {/* Gradient divider */}
          <div className="mb-6 h-px bg-gradient-to-r from-transparent via-voraz-gray-700 to-transparent" />

          <p className="text-[11px] leading-relaxed text-voraz-gray-500">
            Este sitio organiza y resume información de fuentes públicas
            mediante inteligencia artificial. No realiza acusaciones, no afirma
            culpabilidad y no reemplaza el criterio del lector. Revisa siempre
            las fuentes originales.
          </p>
        </div>
      </div>
    </footer>
  );
}
