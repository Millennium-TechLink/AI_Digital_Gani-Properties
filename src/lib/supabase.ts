import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Some features may not work.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to get service client (for admin operations - use in serverless functions only)
export function getSupabaseServiceClient() {
  const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    throw new Error('Supabase service key not available in client');
  }
  if (!supabaseUrl) {
    throw new Error('Supabase URL not configured');
  }
  return createClient(supabaseUrl, serviceKey);
}

