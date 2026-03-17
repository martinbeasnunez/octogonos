import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;
let supabaseAdminClient: ReturnType<typeof createClient> | null = null;

// Public client (anon key) — for inserts from client-side tracking
function initializeSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

// Admin client (service role key) — bypasses RLS, for server-side reads
function initializeSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseAdminClient;
}

export const supabase = initializeSupabase();
export const supabaseAdmin = initializeSupabaseAdmin();

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
