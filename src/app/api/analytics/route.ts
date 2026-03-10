import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import {
  type AnalyticsPeriod,
  getDateRange,
  getComparisonRange,
  getLast7Days,
} from '@/lib/analytics-dates';

// ── Types ────────────────────────────────────────────────────────

interface PageView {
  visitor_id: string;
  page_path: string;
  referrer: string | null;
  created_at: string;
}

interface Insight {
  icon: string;
  text: string;
}

// ── Helpers ──────────────────────────────────────────────────────

function slugToLabel(path: string): string {
  // "/c/keiko-fujimori" → "Keiko Fujimori"
  const slug = path.replace(/^\/(c|candidato)\//, '');
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

function generateInsights(
  periodViews: PageView[],
  dailyViews: Array<{ label: string; views: number; visitors: number }>,
  period: AnalyticsPeriod,
  compChange: number | null
): Insight[] {
  const insights: Insight[] = [];

  // 1) Peak day
  const nonEmpty = dailyViews.filter((d) => d.views > 0);
  if (nonEmpty.length > 0) {
    const peak = nonEmpty.reduce((a, b) => (b.views > a.views ? b : a));
    insights.push({
      icon: '📈',
      text: `Día pico: ${peak.label} con ${peak.views.toLocaleString('es-PE')} visitas`,
    });
  }

  // 2) Growth trend
  if (compChange !== null && compChange !== 0) {
    insights.push(
      compChange > 0
        ? { icon: '🚀', text: `Tráfico creció ${compChange}% vs periodo anterior` }
        : { icon: '📉', text: `Tráfico bajó ${Math.abs(compChange)}% vs periodo anterior` }
    );
  }

  // 3) Direct vs referred
  const directCount = periodViews.filter(
    (v) => !v.referrer || v.referrer === 'Direct'
  ).length;
  const totalViews = periodViews.length;
  if (totalViews > 0) {
    const directPct = Math.round((directCount / totalViews) * 100);
    if (directPct >= 60) {
      insights.push({
        icon: '🔗',
        text: `${directPct}% del tráfico es directo — buen reconocimiento de marca`,
      });
    } else {
      insights.push({
        icon: '🌐',
        text: `${100 - directPct}% del tráfico viene de enlaces externos`,
      });
    }
  }

  // 4) Avg daily visitors (week / all)
  if (['week', 'all'].includes(period) && nonEmpty.length > 0) {
    const avg = Math.round(
      nonEmpty.reduce((s, d) => s + d.visitors, 0) / nonEmpty.length
    );
    insights.push({
      icon: '👥',
      text: `Promedio diario: ${avg} visitantes únicos`,
    });
  }

  return insights.slice(0, 3);
}

// ── Empty response (Supabase not configured) ────────────────────

function emptyResponse(period: AnalyticsPeriod) {
  const range = getDateRange(period);
  return NextResponse.json({
    period,
    periodLabel: range.label,
    stats: {
      pageViews: 0,
      uniqueVisitors: 0,
      newVisitors: 0,
      returningVisitors: 0,
      corrections: 0,
    },
    comparison: null,
    dailyViews: getLast7Days().map((d) => ({ ...d, views: 0, visitors: 0 })),
    topPages: [],
    topReferrers: [],
    insights: [],
    corrections: [],
    lastUpdated: new Date().toISOString(),
  });
}

// ── GET handler ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const periodParam =
    (request.nextUrl.searchParams.get('period') as AnalyticsPeriod) || 'all';
  const period: AnalyticsPeriod = ['today', 'yesterday', 'week', 'all'].includes(
    periodParam
  )
    ? periodParam
    : 'all';

  try {
    if (!supabase) throw new Error('Supabase not configured');

    const range = getDateRange(period);
    const compRange = getComparisonRange(period);

    // ── 1) Page views for the selected period ──────────────
    const pvQuery = (supabase as any)
      .from('page_views')
      .select('visitor_id, page_path, referrer, created_at')
      .gte('created_at', range.start.toISOString())
      .lt('created_at', range.end.toISOString());

    const { data: periodViews, error: pvErr } = await pvQuery;
    if (pvErr) throw pvErr;
    const views: PageView[] = periodViews || [];

    // ── 2) Comparison period views ─────────────────────────
    let compViews: PageView[] = [];
    if (compRange) {
      const { data, error } = await (supabase as any)
        .from('page_views')
        .select('visitor_id')
        .gte('created_at', compRange.start.toISOString())
        .lt('created_at', compRange.end.toISOString());
      if (!error && data) compViews = data;
    }

    // ── 3) Prior visitors (for new vs returning) ───────────
    let priorVisitorIds = new Set<string>();
    if (period !== 'all') {
      const { data } = await (supabase as any)
        .from('page_views')
        .select('visitor_id')
        .lt('created_at', range.start.toISOString());
      if (data) {
        priorVisitorIds = new Set(data.map((r: any) => r.visitor_id));
      }
    }

    // ── 4) Last 7 days breakdown (always) ──────────────────
    const sevenAgo = new Date();
    sevenAgo.setDate(sevenAgo.getDate() - 7);
    sevenAgo.setHours(0, 0, 0, 0);
    const { data: weekRaw } = await (supabase as any)
      .from('page_views')
      .select('visitor_id, created_at')
      .gte('created_at', sevenAgo.toISOString());

    const last7 = getLast7Days();
    const dailyMap = new Map<string, { views: number; visitors: Set<string> }>();
    last7.forEach((d) => dailyMap.set(d.date, { views: 0, visitors: new Set() }));
    (weekRaw || []).forEach((r: any) => {
      const day = r.created_at?.split('T')[0];
      const bucket = dailyMap.get(day);
      if (bucket) {
        bucket.views++;
        bucket.visitors.add(r.visitor_id);
      }
    });
    const dailyViews = last7.map((d) => {
      const bucket = dailyMap.get(d.date);
      return {
        date: d.date,
        label: d.label,
        views: bucket?.views ?? 0,
        visitors: bucket?.visitors.size ?? 0,
      };
    });

    // ── 5) Corrections count for period ────────────────────
    let corrQuery = (supabase as any)
      .from('corrections')
      .select('*', { count: 'exact', head: true });
    if (period !== 'all') {
      corrQuery = corrQuery
        .gte('created_at', range.start.toISOString())
        .lt('created_at', range.end.toISOString());
    }
    const { count: corrCount } = await corrQuery;

    // ── 6) All corrections (for list in admin) ─────────────
    const { data: allCorrections } = await (supabase as any)
      .from('corrections')
      .select('*')
      .order('created_at', { ascending: false });

    // ── Compute stats ──────────────────────────────────────
    const uniqueIds = new Set(views.map((v) => v.visitor_id));
    const uniqueVisitors = uniqueIds.size;
    let newVisitors = 0;
    let returningVisitors = 0;
    if (period === 'all') {
      newVisitors = uniqueVisitors;
    } else {
      uniqueIds.forEach((id) => {
        if (priorVisitorIds.has(id)) returningVisitors++;
        else newVisitors++;
      });
    }

    const compUniqueVisitors = new Set(compViews.map((v: any) => v.visitor_id)).size;
    const pageViewsChange = compRange ? pctChange(views.length, compViews.length) : null;
    const visitorsChange = compRange
      ? pctChange(uniqueVisitors, compUniqueVisitors)
      : null;

    // ── Top pages ──────────────────────────────────────────
    const pageCounts: Record<string, number> = {};
    views.forEach((v) => {
      pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .map(([path, viewCount]) => ({
        path,
        label: path.startsWith('/c/') ? slugToLabel(path) : path === '/' ? 'Home' : path,
        views: viewCount,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // ── Top referrers ──────────────────────────────────────
    const refCounts: Record<string, number> = {};
    views.forEach((v) => {
      const ref = v.referrer || 'Directo';
      refCounts[ref] = (refCounts[ref] || 0) + 1;
    });
    const totalForPct = views.length || 1;
    const topReferrers = Object.entries(refCounts)
      .map(([referrer, count]) => ({
        referrer,
        count,
        percentage: Math.round((count / totalForPct) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // ── Insights ───────────────────────────────────────────
    const insights = generateInsights(views, dailyViews, period, pageViewsChange);

    return NextResponse.json({
      period,
      periodLabel: range.label,
      stats: {
        pageViews: views.length,
        uniqueVisitors,
        newVisitors,
        returningVisitors,
        corrections: corrCount ?? 0,
      },
      comparison: compRange
        ? {
            pageViews: compViews.length,
            pageViewsChange,
            uniqueVisitors: compUniqueVisitors,
            uniqueVisitorsChange: visitorsChange,
          }
        : null,
      dailyViews,
      topPages,
      topReferrers,
      insights,
      corrections:
        allCorrections?.map((c: any) => ({
          id: c.id,
          candidate_name: c.candidate_name,
          candidate_slug: c.candidate_slug,
          email: c.email,
          message: c.message,
          correction_text: c.correction_text,
          status: c.status,
          created_at: c.created_at,
        })) || [],
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return emptyResponse(period);
  }
}
