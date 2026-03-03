import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Correction {
  id?: string;
  created_at?: string;
  candidate_slug: string;
  candidate_name: string;
  email: string;
  message: string;
  correction_text: string;
  status: 'pending' | 'reviewed' | 'published' | 'rejected';
  url_context?: string;
}
