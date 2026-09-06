import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from client environment variables if provided
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://xyzcompany.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Initialize Supabase client if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
