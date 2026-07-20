import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Boshlang'ichda current sessiyani tekshiramiz
    async function getSession() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    getSession();

    // Auth state o'zgarishlarni kuzatamiz (login/logout)
    const result = supabase?.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      result?.data.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
