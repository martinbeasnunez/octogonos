"use client";

import { useState, useMemo } from "react";
import {
  candidates,
  queryCandidates,
  filterLabels,
  type SortOption,
  type FilterOption,
} from "@/data/candidates";
import CandidateCard from "./CandidateCard";

const sortOptions: { value: SortOption; label: string; icon: string }[] = [
  { value: "encuestas", label: "Mayor %", icon: "↓" },
  { value: "az", label: "A → Z", icon: "" },
];

const filterOptions: FilterOption[] = [
  "todos",
  "sentencia",
  "pendiente",
  "posgrado",
  "sin-plan",
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("encuestas");
  const [filter, setFilter] = useState<FilterOption>("todos");

  const results = useMemo(
    () => queryCandidates(query, sort, filter),
    [query, sort, filter]
  );

  return (
    <div>
      <div className="relative mb-4">
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

      {/* Sort + Filter bar */}
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-voraz-gray-300">Ordenar</span>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-200 ${
                sort === opt.value
                  ? "bg-voraz-black text-voraz-white shadow-sm"
                  : "bg-voraz-white text-voraz-gray-500 hover:bg-voraz-gray-50 hover:text-voraz-black"
              }`}
            >
              {opt.icon && <span className="mr-1">{opt.icon}</span>}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden h-4 w-px bg-voraz-gray-200 sm:block" />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-voraz-gray-300">Filtrar</span>
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f === filter ? "todos" : f)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-200 ${
                filter === f
                  ? f === "sentencia"
                    ? "bg-voraz-red/10 text-voraz-red"
                    : f === "pendiente"
                      ? "bg-voraz-gold/10 text-voraz-gold"
                      : f === "posgrado"
                        ? "bg-score-bajo/10 text-score-bajo"
                        : "bg-voraz-black text-voraz-white shadow-sm"
                  : "bg-voraz-white text-voraz-gray-500 hover:bg-voraz-gray-50 hover:text-voraz-black"
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Result count + poll transparency */}
      <div className="mb-4">
        <p className="text-xs text-voraz-gray-400">
          {results.length} de {candidates.length} candidatos
          {sort === "encuestas" && (
            <span> · ordenados por encuestas</span>
          )}
        </p>
        {sort === "encuestas" && (
          <p className="mt-0.5 text-[10px] text-voraz-gray-300">
            Promedio de encuestas publicadas en medios · Actualizado: 1 mar 2026
          </p>
        )}
      </div>

      {/* No results state */}
      {results.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-display text-lg font-bold uppercase text-voraz-gray-400">
            Sin resultados
          </p>
          <p className="mt-2 text-sm text-voraz-gray-400">
            {query
              ? `No se encontraron candidatos para "${query}"`
              : "No hay candidatos con ese filtro"}
          </p>
          {filter !== "todos" && (
            <button
              onClick={() => setFilter("todos")}
              className="mt-4 rounded-full bg-voraz-black px-4 py-2 text-xs font-bold text-voraz-white transition-colors hover:bg-voraz-red"
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
