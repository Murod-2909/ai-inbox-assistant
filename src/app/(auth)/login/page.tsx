"use client";

// Kirish sahifasi: Google tepada, email+parol, "Parolni unutdim?" havolasi
// parol yorlig'i yonida (namunalardagi standart joylashuv),
// xatolik — forma tepasidagi qizil banner.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleButton from "@/components/auth/GoogleButton";
import styles from "../auth.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
      // Xavfsizlik qoidasi: qaysi maydon xatoligini oshkor qilmaymiz
      setError("Email yoki parol noto'g'ri. Qayta urinib ko'ring.");
      return;
    }

    // Demo: Supabase Auth ulangach signInWithPassword() bo'ladi.
    // "remember" keyin sessiya muddatini belgilaydi.
    setLoading(true);
    setTimeout(() => router.push("/inbox"), 600);
  }

  return (
    <div>
      <h1 className={styles.title}>Xush kelibsiz!</h1>
      <p className={styles.subtitle}>Hisobingizga kiring</p>

      <GoogleButton label="Google bilan kirish" />
      <div className={styles.divider}>yoki</div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="siz@biznes.uz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="password">Parol</label>
            <Link href="/reset">Parolni unutdingizmi?</Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Meni eslab qol
        </label>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Kirilmoqda..." : "Kirish"}
        </button>
      </form>

      <p className={styles.switchLine}>
        Hisobingiz yo&apos;qmi? <Link href="/signup">Ro&apos;yxatdan o&apos;ting</Link>
      </p>
    </div>
  );
}
