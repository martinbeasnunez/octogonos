import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Corrections feature is not available' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('corrections')
      .insert([
        {
          candidate_slug: body.candidate_slug,
          candidate_name: body.candidate_name,
          email: body.email,
          message: body.message,
          correction_text: body.correction_text,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Error saving correction' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
