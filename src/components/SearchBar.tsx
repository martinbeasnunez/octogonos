"use client";

import { useState, useMemo } from "react";
import {
  candidates,
  queryCandidates,
  filterLabels,
  type FilterOption,
  type SortOption,
} from "@/data/candidates";
import CandidateCard from "./CandidateCard";

const filterOptions: FilterOption[] = [
  "todos",
  "sentencia",
  "pendiente",
  "posgrado",
  "sin-plan",
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("az");
  const [filter, setFilter] = useState<FilterOption>("todos");

  const results = useMemo(
    () => queryCandidates(query, sort, filter),
    [query, sort, filter]
  );

  return (
    <div>
      {/* Sticky search + filters on mobile */}
      <div className="sticky top-11 z-40 -mx-6 bg-voraz-black/95 px-6 pb-3 pt-2 backdrop-blur-sm sm:-mx-0 sm:px-0">
        <div className="relative mb-3 sm:mb-4">
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
            className="w-full rounded-xl bg-white/10 py-3 pl-11 pr-20 text-sm text-white shadow-none placeholder:text-white/40 transition-shadow duration-300 focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-white/20 sm:py-4 sm:pl-12 sm:pr-24"
          />

          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3">
            {query && (
              <button
                onClick={() => setQuery("")}
                className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/60 transition-colors hover:bg-voraz-red/20 hover:text-voraz-red"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Sort + Filter bar */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-x-4">
          {/* Sort */}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Ordenar</span>
          {([
            { key: "encuestas" as SortOption, label: "Mayor %" },
            { key: "az" as SortOption, label: "A → Z" },
          ]).map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-200 ${
                sort === s.key
                  ? "bg-voraz-red text-white shadow-sm"
                  : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}

          {/* Divider on desktop */}
          <span className="hidden h-4 w-px bg-white/20 sm:block" />

          {/* Filter */}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Filtrar</span>
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f === filter ? "todos" : f)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-200 ${
                filter === f
                  ? f === "sentencia"
                    ? "bg-voraz-red/20 text-voraz-red"
                    : f === "pendiente"
                      ? "bg-voraz-gold/20 text-voraz-gold"
                      : f === "posgrado"
                        ? "bg-score-bajo/20 text-score-bajo"
                        : "bg-white/20 text-white shadow-sm"
                  : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="mb-4 mt-3">
        <p className="text-xs text-white/40">
          {results.length} de {candidates.length} candidatos{sort === "encuestas" ? " — ordenados por encuestas" : " — orden alfabético"}
        </p>
        {sort === "encuestas" && (
          <p className="text-[10px] text-white/30">
            Promedio de encuestas publicadas en medios — Actualizado 2026
          </p>
        )}
      </div>

      {/* No results state */}
      {results.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-display text-lg font-bold uppercase text-white/40">
            Sin resultados
          </p>
          <p className="mt-2 text-sm text-white/40">
            {query
              ? `No se encontraron candidatos para "${query}"`
              : "No hay candidatos con ese filtro"}
          </p>
          {filter !== "todos" && (
            <button
              onClick={() => setFilter("todos")}
              className="mt-4 rounded-full bg-voraz-red px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-voraz-red/80"
            >
              Mostrar todos
            </button>
          )}
        </div>
      )}

      {/* Card grid */}
      {results.length > 0 && (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
