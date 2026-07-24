"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function PublicAuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // Agar foydalanuvchi allaqachon login qilgan bo'lsa — dashboard'ga yo'naltir
    if (!loading && user) {
      router.push("/inbox");
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
        {t("auth.checkingSession")}
      </div>
    );
  }

  if (user) {
    return null; // Redirect qilinyabdi
  }

  return <>{children}</>;
}
