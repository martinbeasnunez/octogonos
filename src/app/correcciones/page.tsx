import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Correcciones — Octógonos",
  description: "Registro público de correcciones realizadas en Octógonos.",
};

const corrections = [
  {
    date: "2026-03-03",
    description:
      "Lanzamiento V1 con 36 candidatos presidenciales. Data extraída de JNE Voto Informado (hojas de vida, sentencias declaradas, planes de gobierno).",
    affected: "General",
  },
];

export default function CorreccionesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-voraz-gray-400 transition-colors hover:text-voraz-black"
      >
        <span>←</span> Inicio
      </Link>

      <div className="mb-12 animate-hero-reveal">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-voraz-black sm:text-5xl">
          Correcciones
        </h1>
        <div className="mt-4 h-1 w-12 bg-voraz-red" />
        <p className="mt-4 text-sm leading-relaxed text-voraz-gray-500">
          Registro público de cambios y correcciones. Si encuentras un error,{" "}
          <a
            href="mailto:correcciones@ejemplo.com"
            className="text-voraz-red hover:underline"
          >
            escríbenos
          </a>
          .
        </p>
      </div>

      {/* Timeline */}
      <div className="relative ml-4 border-l-2 border-voraz-gray-200 pl-8">
        {corrections.map((c, i) => (
          <div key={i} className="relative pb-10 last:pb-0">
            {/* Timeline dot */}
            <div className="absolute -left-[calc(2rem+5px)] top-1 flex h-2.5 w-2.5 items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-voraz-red" />
            </div>

            {/* Date */}
            <time className="mb-3 block font-mono text-sm font-medium text-voraz-gray-400">
              {c.date}
            </time>

            {/* Card */}
            <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
              <span className="mb-3 inline-block rounded-full bg-voraz-gray-100 px-3 py-1 text-[11px] font-semibold text-voraz-gray-500">
                {c.affected}
              </span>
              <p className="text-sm leading-relaxed text-voraz-gray-600">
                {c.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-12 rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-soft)]">
        <div className="border-l-2 border-voraz-gray-200 pl-4">
          <p className="text-xs leading-relaxed text-voraz-gray-500">
            Nos comprometemos a corregir cualquier error de forma pública y
            transparente. Si encuentras información incorrecta, repórtala y la
            revisaremos a la brevedad.
          </p>
        </div>
      </div>
    </div>
  );
}
