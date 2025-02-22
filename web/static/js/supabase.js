import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { 
      redirectTo: process.env.SUPABASE_CALLBACK_URL
    }
  });
  if (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
  return data;
} 