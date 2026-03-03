import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ ok: false }, { status: 503 });
    }

    const { page_path, referrer, candidate_slug, candidate_name } =
      await request.json();

    // Generate a simple visitor ID from IP + user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0] ?? 'unknown';
    const ua = request.headers.get('user-agent') ?? '';
    const visitor_id = btoa(`${ip}:${ua}`).slice(0, 32);

    // Track page view
    if (page_path) {
      await supabase.from('page_views').insert({
        page_path,
        referrer: referrer || null,
        visitor_id,
        user_agent: ua.slice(0, 256),
      });
    }

    // Track candidate view
    if (candidate_slug && candidate_name) {
      const { data: existing } = await supabase
        .from('candidate_views')
        .select('id, view_count')
        .eq('candidate_slug', candidate_slug)
        .single();

      if (existing) {
        await supabase
          .from('candidate_views')
          .update({ view_count: existing.view_count + 1 })
          .eq('id', existing.id);
      } else {
        await supabase.from('candidate_views').insert({
          candidate_slug,
          candidate_name,
          view_count: 1,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
