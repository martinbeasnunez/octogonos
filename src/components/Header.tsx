"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-voraz-black/95 backdrop-blur-sm">
      <div className="mx-auto flex h-11 max-w-4xl items-center justify-between px-6 lg:max-w-6xl">
        {/* Brand — VORAZ logo */}
        <Link
          href="/"
          className="group flex items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo-voraz.png"
            alt="VORAZ"
            width={80}
            height={30}
            className="h-6 w-auto brightness-0 invert"
            priority
          />
          <span className="inline-block h-1 w-1 rounded-full bg-voraz-red transition-transform duration-300 group-hover:scale-150" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-5 text-[11px] sm:flex">
          <Link
            href="/metodologia"
            className="relative py-1 text-white/60 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-voraz-red after:transition-all after:duration-300 hover:after:w-full"
          >
            Metodología
          </Link>
          <Link
            href="/correcciones"
            className="relative py-1 text-white/60 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-voraz-red after:transition-all after:duration-300 hover:after:w-full"
          >
            Correcciones
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/10 sm:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — overlay dropdown */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden border-b border-white/10 bg-voraz-black/98 backdrop-blur-md transition-all duration-300 sm:hidden ${
          menuOpen
            ? "max-h-40 opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-3">
          <Link
            href="/metodologia"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Metodología
          </Link>
          <Link
            href="/correcciones"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Correcciones
          </Link>
        </nav>
      </div>
    </header>
  );
}
