import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTracker from "@/components/PageTracker";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Octógonos de candidatos + IA",
  description:
    "Toda la info de cada candidato presidencial 2026 en un solo lugar. Educación, historial legal y plan de gobierno — con fuentes oficiales del JNE. Powered by VORAZ.",
  openGraph: {
    title: "Octógonos de candidatos + IA",
    description:
      "Educación, historial legal y plan de gobierno de cada candidato. Con fuentes oficiales. Análisis con IA. Powered by VORAZ.",
    type: "website",
    url: "https://octogonos.vercel.app",
    siteName: "Octógonos",
    images: [
      {
        url: "https://octogonos.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Octógonos de candidatos + IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Octógonos de candidatos + IA",
    description: "Educación, historial legal y plan de gobierno. Con IA.",
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
      <body
        className={`${inter.variable} ${barlowCondensed.variable} font-sans antialiased`}
      >
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
