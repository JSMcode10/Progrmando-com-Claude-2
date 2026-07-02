import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase.js';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!supabaseConfigured) return { error: { message: 'Supabase não configurado.' } };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(async (email, password) => {
    if (!supabaseConfigured) return { error: { message: 'Supabase não configurado.' } };
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabaseConfigured) return;
    await supabase.auth.signOut();
  }, []);

  return {
    session,
    user: session?.user ?? null,
    loading,
    signIn,
    signUp,
    signOut,
    supabaseConfigured,
  };
}
