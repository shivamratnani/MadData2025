import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asvklpcdktvzxpfcezzu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdmtscGNka3R2enhwZmNlenp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDg5MDUsImV4cCI6MjA1NTgyNDkwNX0.xa_irWra_MGXGpISOd5AlDoCw6y6Qi7FuaDQ97aWVw4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000" },  // Set redirect URL directly
    });
  
    if (error) {
      console.error("Error signing in with Google:", error);
      return null;
    }
  
    // Redirect to dashboard after successful login
    console.log(data)
    window.location.href = "/dashboard";
    return data
  }
export async function signOut() {
    await supabase.auth.signOut();
    localStorage.removeItem("supabase_session");
    window.location.reload();
  }
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      localStorage.setItem("supabase_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("supabase_session");
    }
  });