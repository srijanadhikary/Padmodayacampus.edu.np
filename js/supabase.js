// Padmodaya Campus - Supabase bootstrap
let SUPABASE = null;
let SUPABASE_CONFIG = null;

async function initSupabase() {
  if (SUPABASE) return SUPABASE;
  const response = await fetch('/api/config.js', { cache: 'no-store' });
  if (!response.ok) throw new Error('Could not load Supabase configuration.');
  SUPABASE_CONFIG = await response.json();
  if (!SUPABASE_CONFIG.supabaseUrl || !SUPABASE_CONFIG.supabasePublishableKey) {
    throw new Error('Supabase environment variables are not configured in Vercel.');
  }
  SUPABASE = window.supabase.createClient(
    SUPABASE_CONFIG.supabaseUrl,
    SUPABASE_CONFIG.supabasePublishableKey,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );
  return SUPABASE;
}
