import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTracker from "@/components/PageTracker";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  title: "Los Octógonos de los Candidatos x VORAZ | Elecciones 2026",
  description:
    "Porque si algo tiene octógonos, todos tenemos el derecho de saberlo. Educación, alertas legales y viabilidad de cada candidato presidencial — con IA y fuentes públicas oficiales.",
  openGraph: {
    title: "Los Octógonos de los Candidatos x VORAZ",
    description:
      "Porque si algo tiene octógonos, todos tenemos el derecho de saberlo. Educación, alertas legales y viabilidad de cada candidato — Elecciones 2026.",
    type: "website",
    url: "https://octogonos.vercel.app",
    siteName: "Octógonos x VORAZ",
    images: [
      {
        url: "https://octogonos.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Los Octógonos de los Candidatos x VORAZ — Elecciones 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Los Octógonos de los Candidatos x VORAZ",
    description:
      "Porque si algo tiene octógonos, todos tenemos el derecho de saberlo. Elecciones 2026 — con IA y fuentes oficiales.",
    images: ["https://octogonos.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-voraz-black font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <PageTracker />
        </div>
      </body>
    </html>
  );
}
