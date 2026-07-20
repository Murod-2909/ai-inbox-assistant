"use client";

// Auth sahifalari (login/signup/reset) uchun umumiy qobiq:
// markazda karta, tepada bosh sahifaga qaytaruvchi logo.
// Supabase ulangan bo'lsa: allaqachon login qilgan users → /inbox ga yo'naltiriladi
import Link from "next/link";
import { PublicAuthLayout } from "@/components/PublicAuthLayout";
import styles from "./auth.module.scss";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicAuthLayout>
      <div className={styles.shell}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>AI</span> Inbox Assistant
        </Link>
        <div className={styles.card}>{children}</div>
        <p className={styles.demoNote}>
          Supabase ulangan bo'lsa — haqiqiy autentifikatsiya ishlaydi
        </p>
      </div>
    </PublicAuthLayout>
  );
}
