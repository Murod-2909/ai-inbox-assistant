"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

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
        Yuklanmoqda...
      </div>
    );
  }

  if (!user) {
    return null; // Redirect qilinyabdi
  }

  return <>{children}</>;
}
