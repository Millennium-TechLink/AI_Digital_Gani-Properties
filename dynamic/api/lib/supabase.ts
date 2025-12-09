import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL, SUPABASE_SERVICE_KEY, and SUPABASE_ANON_KEY');
}

// Service role client (for server-side operations with admin privileges)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Anon client (for client-side operations)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Default export (use admin for API routes)
export const supabase = supabaseAdmin;

// Verify Supabase JWT token
export async function verifySupabaseToken(token: string) {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error) throw error;
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

