import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface SitePage {
  title: string;
  content: string;
  updated_at: string;
}

async function getPage(): Promise<SitePage | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("site_pages")
    .select("title, content, updated_at")
    .eq("slug", "terminos")
    .single();
  if (error || !data) return null;
  return data as SitePage;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return {
    title: `${page?.title ?? "Términos y Condiciones"} — Octógonos`,
    description:
      "Términos y condiciones de uso de Octógonos, la plataforma de información electoral del Perú.",
  };
}

export default async function TerminosPage() {
  const page = await getPage();

  return (
    <div>
      {/* Hero — dark band */}
      <div className="bg-voraz-dark">
        <div className="mx-auto max-w-4xl px-6 pb-12 pt-6 sm:pb-16 sm:pt-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-voraz-gray-500 transition-colors hover:text-voraz-cream sm:mb-10"
          >
            <span className="transition-transform duration-200 hover:-translate-x-0.5">
              ←
            </span>
            Inicio
          </Link>

          <div className="animate-hero-reveal">
            <span className="mb-3 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-voraz-gray-500">
              Legal
            </span>
            <h1 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-voraz-white sm:text-5xl lg:text-6xl">
              {page?.title ?? "Términos y Condiciones"}
            </h1>
            <div className="mt-5 h-1 w-12 bg-voraz-red" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-10 sm:py-16">
        {page ? (
          <>
            <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)] sm:p-10">
              <div
                className="prose prose-sm max-w-none text-voraz-gray-600 prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-voraz-black prose-a:text-voraz-red prose-a:no-underline hover:prose-a:underline prose-strong:text-voraz-black prose-li:marker:text-voraz-red"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>

            {page.updated_at && (
              <p className="mt-6 text-center text-[11px] text-voraz-gray-400">
                Última actualización:{" "}
                {new Date(page.updated_at).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </>
        ) : (
          <div className="rounded-2xl bg-voraz-white p-10 text-center shadow-[var(--shadow-card)]">
            <p className="text-sm text-voraz-gray-500">
              Esta página estará disponible pronto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
