import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://dijahpzbfopssmkatvxv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_34CYdGaZXy6OznTitNk2TQ_oaJ3rVHC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

