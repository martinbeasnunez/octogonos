import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch page views
    const { data: pageViews, error: pvError } = await supabase
      .from('page_views')
      .select('*');

    if (pvError) throw pvError;

    // Fetch candidate views
    const { data: candidateViews, error: cvError } = await supabase
      .from('candidate_views')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(5);

    if (cvError) throw cvError;

    // Fetch corrections
    const { data: corrections, error: corrError } = await supabase
      .from('corrections')
      .select('*');

    if (corrError) throw corrError;

    const totalPageViews = pageViews?.length || 0;
    const uniqueVisitors = new Set(pageViews?.map((p: any) => p.visitor_id) || []).size;

    return NextResponse.json({
      totalPageViews,
      uniqueVisitors,
      totalCorrectionsFiled: corrections?.length || 0,
      mostViewedCandidates:
        candidateViews?.map((c: any) => ({
          name: c.candidate_name,
          views: c.view_count,
        })) || [],
      topReferrers: pageViews
        ? Object.entries(
            pageViews.reduce(
              (acc: any, pv: any) => {
                const ref = pv.referrer || 'Direct';
                acc[ref] = (acc[ref] || 0) + 1;
                return acc;
              },
              {}
            )
          )
            .map(([referrer, count]) => ({ referrer, count: count as number }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
        : [],
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Analytics error:', err);
    // Return mock data if Supabase isn't configured
    return NextResponse.json({
      totalPageViews: 0,
      uniqueVisitors: 0,
      totalCorrectionsFiled: 0,
      mostViewedCandidates: [],
      topReferrers: [],
      lastUpdated: new Date().toISOString(),
    });
  }
}
