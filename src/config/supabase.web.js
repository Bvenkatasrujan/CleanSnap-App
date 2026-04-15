import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dijahpzbfopssmkatvxv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_34CYdGaZXy6OznTitNk2TQ_oaJ3rVHC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
