import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;

// Initialize at module load time (returns null if env vars missing)
function initializeSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

export const supabase = initializeSupabase();

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

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
