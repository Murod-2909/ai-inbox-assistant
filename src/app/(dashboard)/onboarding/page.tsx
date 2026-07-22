"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GettingStarted } from "@/components/onboarding/GettingStarted";

export default function OnboardingPage() {
  const [name, setName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      const fullName = user?.user_metadata?.full_name as string | undefined;
      setName(fullName?.split(" ")[0] || user?.email?.split("@")[0]);
    });
  }, []);

  return <GettingStarted name={name} />;
}
