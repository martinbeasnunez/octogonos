import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-voraz-red">
      <div className="mx-auto max-w-4xl px-6 pb-10 pt-10 lg:max-w-6xl">
        {/* Brand */}
        <div className="mb-4">
          <span className="font-display text-lg font-black uppercase tracking-tight text-white sm:text-xl">
            Los octógonos de los candidatos
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-white/70">por</span>
            <Image
              src="/logo-voraz.png"
              alt="VORAZ"
              width={80}
              height={30}
              className="h-5 w-auto"
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Información pública organizada por IA. No afirmamos culpabilidad.
          </p>
        </div>

        {/* Nav links — bold white uppercase */}
        <nav className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href="/metodologia"
            className="font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:text-white/70"
          >
            Metodología
          </Link>
          <Link
            href="/correcciones"
            className="font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:text-white/70"
          >
            Correcciones
          </Link>
          <Link
            href="/terminos"
            className="font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:text-white/70"
          >
            Términos
          </Link>
          <Link
            href="/privacidad"
            className="font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:text-white/70"
          >
            Privacidad
          </Link>
        </nav>

        {/* Legal text */}
        <p className="text-xs leading-relaxed text-white/60">
          Este sitio organiza y resume información de fuentes públicas
          mediante inteligencia artificial. No realiza acusaciones, no afirma
          culpabilidad y no reemplaza el criterio del lector. Revisa siempre
          las fuentes originales.
        </p>
      </div>
    </footer>
  );
}
