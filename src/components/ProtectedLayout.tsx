"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      // Supabase yo'q yoki foydalanuvchi login qilmagan — login'ga yo'naltir
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--color-bg)",
          color: "var(--color-text-muted)",
        }}
      >
        {t("common.loading")}
      </div>
    );
  }

  if (!user) {
    return null; // Redirect qilinyabdi
  }

  return <>{children}</>;
}
