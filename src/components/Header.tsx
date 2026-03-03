"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-voraz-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-11 max-w-4xl items-center justify-between px-6 lg:max-w-6xl">
        {/* Brand — compact */}
        <Link
          href="/"
          className="group flex items-center gap-1.5"
          onClick={() => setMenuOpen(false)}
        >
          <span className="font-display text-[11px] font-black uppercase tracking-[0.15em] text-voraz-black">
            Octógonos
          </span>
          <span className="hidden text-[9px] font-medium text-voraz-gray-400 sm:inline">
            por VORAZ
          </span>
          <span className="inline-block h-1 w-1 rounded-full bg-voraz-red transition-transform duration-300 group-hover:scale-150" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-5 text-[11px] sm:flex">
          <Link
            href="/metodologia"
            className="relative py-1 text-voraz-gray-500 transition-colors hover:text-voraz-black after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-voraz-red after:transition-all after:duration-300 hover:after:w-full"
          >
            Metodología
          </Link>
          <Link
            href="/correcciones"
            className="relative py-1 text-voraz-gray-500 transition-colors hover:text-voraz-black after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-voraz-red after:transition-all after:duration-300 hover:after:w-full"
          >
            Correcciones
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-voraz-gray-100 sm:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <svg
            className="h-4 w-4 text-voraz-black"
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
        className={`absolute left-0 right-0 top-full overflow-hidden border-b border-voraz-gray-100 bg-voraz-cream/98 backdrop-blur-md transition-all duration-300 sm:hidden ${
          menuOpen
            ? "max-h-40 opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-3">
          <Link
            href="/metodologia"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm text-voraz-gray-600 transition-colors hover:bg-voraz-gray-50 hover:text-voraz-black"
          >
            Metodología
          </Link>
          <Link
            href="/correcciones"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm text-voraz-gray-600 transition-colors hover:bg-voraz-gray-50 hover:text-voraz-black"
          >
            Correcciones
          </Link>
        </nav>
      </div>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-voraz-gray-200 to-transparent" />
    </header>
  );
}
