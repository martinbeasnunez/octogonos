'use client';

import { useEffect, useState, useCallback } from 'react';

// ── Types ────────────────────────────────────────────────────────

type Period = 'today' | 'yesterday' | 'week' | 'all';

interface AnalyticsData {
  period: Period;
  periodLabel: string;
  stats: {
    pageViews: number;
    uniqueVisitors: number;
    newVisitors: number;
    returningVisitors: number;
    corrections: number;
  };
  comparison: {
    pageViews: number | null;
    pageViewsChange: number | null;
    uniqueVisitors: number | null;
    uniqueVisitorsChange: number | null;
  } | null;
  dailyViews: Array<{
    date: string;
    label: string;
    views: number;
    visitors: number;
  }>;
  topPages: Array<{
    path: string;
    label: string;
    views: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    count: number;
    percentage: number;
  }>;
  insights: Array<{
    icon: string;
    text: string;
  }>;
  lastUpdated: string;
}

const PERIODS: Array<{ key: Period; label: string }> = [
  { key: 'today', label: 'Hoy' },
  { key: 'yesterday', label: 'Ayer' },
  { key: 'week', label: 'Semana' },
  { key: 'all', label: 'Total' },
];

// ── Sub-components ───────────────────────────────────────────────

function TrendBadge({ change }: { change: number | null | undefined }) {
  if (change === null || change === undefined || change === 0) return null;
  const isUp = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
        isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-[var(--color-voraz-red)]'
      }`}
    >
      {isUp ? '↑' : '↓'} {Math.abs(change)}%
    </span>
  );
}

function StatCard({
  label,
  value,
  colorClass,
  change,
  subtext,
}: {
  label: string;
  value: number;
  colorClass: string;
  change?: number | null;
  subtext?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-voraz-gray-500)]">
          {label}
        </p>
        <TrendBadge change={change} />
      </div>
      <p className={`mt-2 text-3xl font-black ${colorClass}`}>
        {value.toLocaleString('es-PE')}
      </p>
      {subtext && (
        <p className="mt-1 text-[10px] text-[var(--color-voraz-gray-400)]">{subtext}</p>
      )}
    </div>
  );
}

function MiniBarChart({
  dailyViews,
}: {
  dailyViews: AnalyticsData['dailyViews'];
}) {
  const maxViews = Math.max(...dailyViews.map((d) => d.views), 1);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-voraz-gray-500)]">
        Visitas diarias · últimos 7 días
      </h3>
      <div className="flex items-end gap-2" style={{ height: '140px' }}>
        {dailyViews.map((day) => {
          const heightPct = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
          return (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center gap-1"
              style={{ height: '100%' }}
            >
              {/* Value */}
              <span className="text-[10px] font-bold text-[var(--color-voraz-gray-500)]">
                {day.views > 0 ? day.views : ''}
              </span>
              {/* Bar container */}
              <div className="relative w-full flex-1">
                <div
                  className="absolute bottom-0 w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max(heightPct, 3)}%`,
                    backgroundColor: 'var(--color-voraz-red)',
                    opacity: 0.75,
                  }}
                />
              </div>
              {/* Label */}
              <span className="text-[9px] font-medium text-[var(--color-voraz-gray-400)]">
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Visitors subtitle */}
      <div className="mt-3 flex items-end gap-2">
        {dailyViews.map((day) => (
          <div key={day.date + '-v'} className="flex-1 text-center">
            <span className="text-[8px] text-[var(--color-voraz-gray-400)]">
              {day.visitors > 0 ? `${day.visitors} 👤` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsSection({ insights }: { insights: AnalyticsData['insights'] }) {
  if (insights.length === 0) return null;
  return (
    <div className="rounded-2xl bg-[var(--color-voraz-cream)] p-6 ring-1 ring-black/5">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[var(--color-voraz-gray-500)]">
        Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="text-lg leading-none">{insight.icon}</span>
            <p className="text-sm text-[var(--color-voraz-gray-600)]">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBarList({
  title,
  items,
  barColor,
}: {
  title: string;
  items: Array<{ label: string; value: number; pct?: number }>;
  barColor: string;
}) {
  const maxVal = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-voraz-gray-500)]">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-xs text-[var(--color-voraz-gray-400)]">
          Sin datos para este periodo
        </p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item, i) => (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between">
                <span className="max-w-[65%] truncate text-sm text-[var(--color-voraz-gray-600)]">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  {item.pct !== undefined && (
                    <span className="text-[10px] text-[var(--color-voraz-gray-400)]">
                      {item.pct}%
                    </span>
                  )}
                  <span className="text-xs font-bold text-[var(--color-voraz-black)]">
                    {item.value.toLocaleString('es-PE')}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--color-voraz-gray-100)]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.value / maxVal) * 100}%`,
                    backgroundColor: barColor,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="mb-3 h-3 w-24 rounded bg-gray-200" />
      <div className="h-8 w-16 rounded bg-gray-200" />
    </div>
  );
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 ${className}`}
    >
      <div className="mb-4 h-3 w-32 rounded bg-gray-200" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<Period>('all');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (p: Period) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?period=${p}&_t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Error al cargar analytics');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(period);
    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => fetchAnalytics(period), 30_000);
    return () => clearInterval(interval);
  }, [period, fetchAnalytics]);

  return (
    <section className="space-y-6">
      {/* ── Header + Period selector ────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-xs text-[var(--color-voraz-gray-400)]">
            Insights y datos de uso del sitio
          </p>
          <button
            onClick={() => fetchAnalytics(period)}
            disabled={loading}
            className="rounded-full p-1.5 text-[var(--color-voraz-gray-400)] transition-all hover:bg-[var(--color-voraz-cream)] hover:text-[var(--color-voraz-black)] disabled:opacity-50"
            title="Actualizar datos"
          >
            <svg className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-[var(--color-voraz-cream)] p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition-all ${
                period === p.key
                  ? 'bg-[var(--color-voraz-black)] text-white shadow-sm'
                  : 'text-[var(--color-voraz-gray-500)] hover:text-[var(--color-voraz-black)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error state ─────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}{' '}
          <button
            onClick={() => fetchAnalytics(period)}
            className="font-bold underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── Loading skeleton ────────────────────────────────── */}
      {loading && !data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <SkeletonBlock className="lg:col-span-2" />
            <SkeletonBlock />
          </div>
        </>
      )}

      {/* ── Data display ────────────────────────────────────── */}
      {data && (
        <>
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Vistas de página"
              value={data.stats.pageViews}
              colorClass="text-[var(--color-voraz-red)]"
              change={data.comparison?.pageViewsChange}
              subtext={
                data.comparison
                  ? `${data.comparison.pageViews?.toLocaleString('es-PE') ?? 0} periodo anterior`
                  : undefined
              }
            />
            <StatCard
              label="Visitantes únicos"
              value={data.stats.uniqueVisitors}
              colorClass="text-[var(--color-voraz-black)]"
              change={data.comparison?.uniqueVisitorsChange}
              subtext={
                data.comparison
                  ? `${data.comparison.uniqueVisitors?.toLocaleString('es-PE') ?? 0} periodo anterior`
                  : undefined
              }
            />
            <StatCard
              label="Nuevos visitantes"
              value={data.stats.newVisitors}
              colorClass="text-[var(--color-voraz-gold)]"
              subtext={
                data.stats.returningVisitors > 0
                  ? `${data.stats.returningVisitors} recurrentes`
                  : undefined
              }
            />
            <StatCard
              label="Correcciones"
              value={data.stats.corrections}
              colorClass="text-[var(--color-voraz-gray-500)]"
            />
          </div>

          {/* Chart + Insights row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MiniBarChart dailyViews={data.dailyViews} />
            </div>
            <InsightsSection insights={data.insights} />
          </div>

          {/* Tables row */}
          <div className="grid gap-6 lg:grid-cols-2">
            <HorizontalBarList
              title="Páginas más vistas"
              items={data.topPages.map((p) => ({
                label: p.label,
                value: p.views,
              }))}
              barColor="var(--color-voraz-red)"
            />
            <HorizontalBarList
              title="Fuentes de tráfico"
              items={data.topReferrers.map((r) => ({
                label: r.referrer,
                value: r.count,
                pct: r.percentage,
              }))}
              barColor="var(--color-voraz-gold)"
            />
          </div>

          {/* Last updated */}
          <p className="text-right text-[10px] text-[var(--color-voraz-gray-400)]">
            Actualizado:{' '}
            {new Date(data.lastUpdated).toLocaleString('es-PE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
            {loading && ' · cargando...'}
          </p>
        </>
      )}
    </section>
  );
}
