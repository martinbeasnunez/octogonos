import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    // Fetch page views
    const { data: pageViews, error: pvError } = await (supabase as any)
      .from('page_views')
      .select('*');

    if (pvError) throw pvError;

    // Fetch candidate views
    const { data: candidateViews, error: cvError } = await (supabase as any)
      .from('candidate_views')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(5);

    if (cvError) throw cvError;

    // Fetch corrections
    const { data: corrections, error: corrError } = await (supabase as any)
      .from('corrections')
      .select('*')
      .order('created_at', { ascending: false });

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
      corrections:
        corrections?.map((c: any) => ({
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
    // Return mock data if Supabase isn't configured
    return NextResponse.json({
      totalPageViews: 0,
      uniqueVisitors: 0,
      totalCorrectionsFiled: 0,
      mostViewedCandidates: [],
      corrections: [],
      topReferrers: [],
      lastUpdated: new Date().toISOString(),
    });
  }
}
