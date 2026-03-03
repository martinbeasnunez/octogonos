'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Correction {
  id: string;
  candidate_name: string;
  candidate_slug: string;
  email: string;
  message: string;
  correction_text: string;
  status: 'pending' | 'reviewed' | 'published' | 'rejected';
  created_at: string;
}

interface Analytics {
  totalPageViews: number;
  totalCorrectionsFiled: number;
  uniqueVisitors: number;
  mostViewedCandidates: Array<{ name: string; views: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  corrections: Correction[];
  lastUpdated: string;
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-voraz-black">
            Admin
          </h1>
          <p className="mt-2 text-sm text-voraz-gray-500">
            Insights y datos de uso del sitio
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="rounded-lg bg-voraz-red text-voraz-white px-4 py-2 text-sm font-medium transition-colors hover:bg-voraz-red/90"
        >
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-voraz-red/10 border border-voraz-red/30 p-4">
          <p className="text-sm text-voraz-red">{error}</p>
          <p className="mt-2 text-xs text-voraz-gray-500">
            Nota: Conecta Supabase para ver datos reales
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-voraz-gray-500">Cargando datos...</p>
        </div>
      ) : !analytics ? (
        <div className="rounded-2xl bg-voraz-white p-8 text-center shadow-[var(--shadow-card)]">
          <p className="text-voraz-gray-500">Sin datos disponibles</p>
          <p className="mt-2 text-xs text-voraz-gray-400">
            Configure Supabase para ver analytics
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Key metrics */}
          {[
            {
              label: 'Vistas de página',
              value: analytics.totalPageViews,
              color: 'text-voraz-red',
            },
            {
              label: 'Visitantes únicos',
              value: analytics.uniqueVisitors,
              color: 'text-voraz-black',
            },
            {
              label: 'Correcciones enviadas',
              value: analytics.totalCorrectionsFiled,
              color: 'text-voraz-gold',
            },
            {
              label: 'Última actualización',
              value: new Date(analytics.lastUpdated).toLocaleDateString('es-PE'),
              color: 'text-voraz-gray-500',
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-voraz-gray-500">
                {metric.label}
              </p>
              <p className={`mt-2 font-display text-3xl font-black ${metric.color}`}>
                {typeof metric.value === 'number'
                  ? metric.value.toLocaleString('es-PE')
                  : metric.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tables */}
      {analytics && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Most viewed candidates */}
          <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
              Candidatos más vistos
            </h2>
            <div className="space-y-3">
              {analytics.mostViewedCandidates.length === 0 ? (
                <p className="text-xs text-voraz-gray-400">Sin datos</p>
              ) : (
                analytics.mostViewedCandidates.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-voraz-gray-600">{c.name}</span>
                    <span className="font-bold text-voraz-red">{c.views}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top referrers */}
          <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
              Top referrers
            </h2>
            <div className="space-y-3">
              {analytics.topReferrers.length === 0 ? (
                <p className="text-xs text-voraz-gray-400">Sin datos</p>
              ) : (
                analytics.topReferrers.map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-voraz-gray-600">
                      {r.referrer || 'Direct'}
                    </span>
                    <span className="font-bold text-voraz-black">{r.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Corrections list */}
      {analytics && (
        <div className="mt-6 rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-voraz-black">
            Correcciones recibidas
          </h2>
          {analytics.corrections.length === 0 ? (
            <p className="text-xs text-voraz-gray-400">No hay correcciones</p>
          ) : (
            <div className="space-y-3">
              {analytics.corrections.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl bg-voraz-cream/60 p-4 ring-1 ring-voraz-black/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-voraz-black">
                          {c.candidate_name}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            c.status === 'pending'
                              ? 'bg-voraz-gold/20 text-voraz-gold'
                              : c.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : c.status === 'rejected'
                                  ? 'bg-voraz-red/10 text-voraz-red'
                                  : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-voraz-gray-400">
                        {new Date(c.created_at).toLocaleDateString('es-PE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' · '}
                        {c.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-voraz-gray-400">
                        Problema reportado
                      </p>
                      <p className="mt-0.5 text-sm text-voraz-gray-600">
                        {c.message}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-voraz-gray-400">
                        Corrección sugerida
                      </p>
                      <p className="mt-0.5 text-sm text-voraz-gray-600">
                        {c.correction_text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer link */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-voraz-gray-400 transition-colors hover:text-voraz-black"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
