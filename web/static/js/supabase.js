import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asvklpcdktvzxpfcezzu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdmtscGNka3R2enhwZmNlenp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDg5MDUsImV4cCI6MjA1NTgyNDkwNX0.xa_irWra_MGXGpISOd5AlDoCw6y6Qi7FuaDQ97aWVw4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'http://localhost:8000/auth/callback' } // Updated to Django port
  });
  if (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
  return data;
} 