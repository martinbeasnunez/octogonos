"use client";

import { useState, useMemo } from "react";
import {
  candidates,
  searchCandidates,
} from "@/data/candidates";
import CandidateCard from "./CandidateCard";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchCandidates(query), [query]);

  return (
    <div>
      <div className="relative mb-6">
        {/* Search icon */}
        <svg
          className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
            query ? "text-voraz-red" : "text-voraz-gray-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>

        <input
          type="text"
          placeholder="Buscar candidato o partido..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl bg-voraz-white py-3.5 pl-11 pr-20 text-sm text-voraz-dark shadow-[var(--shadow-search)] placeholder:text-voraz-gray-400 transition-shadow duration-300 focus:shadow-[var(--shadow-card-hover)] focus:outline-none sm:py-4 sm:pl-12 sm:pr-24"
        />

        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3">
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded-full bg-voraz-gray-100 px-3 py-1 text-[11px] font-semibold text-voraz-gray-500 transition-colors hover:bg-voraz-red/10 hover:text-voraz-red"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {query && results.length > 0 && (
        <p className="mb-4 text-xs text-voraz-gray-400">
          {results.length} de {candidates.length} candidatos
        </p>
      )}

      {/* No results state */}
      {query && results.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-display text-lg font-bold uppercase text-voraz-gray-400">
            Sin resultados
          </p>
          <p className="mt-2 text-sm text-voraz-gray-400">
            No se encontraron candidatos para &ldquo;{query}&rdquo;
          </p>
        </div>
      )}

      {/* Card grid */}
      {results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((candidate, i) => (
            <div
              key={candidate.slug}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
            >
              <CandidateCard candidate={candidate} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
