"use client";

// Kirish sahifasi: Google tepada, email+parol, "Parolni unutdim?" havolasi
// parol yorlig'i yonida (namunalardagi standart joylashuv),
// xatolik — forma tepasidagi qizil banner.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleButton from "@/components/auth/GoogleButton";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "../auth.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
      // Xavfsizlik qoidasi: qaysi maydon xatoligini oshkor qilmaymiz
      setError(t("auth.login.errorGeneric"));
      return;
    }

    setLoading(true);

    // Supabase ulangan bo'lsa — haqiqiy kirish
    if (supabase) {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setLoading(false);
        setError(
          authError.message === "Email not confirmed"
            ? t("auth.login.errorNotConfirmed")
            : t("auth.login.errorGeneric"),
        );
        return;
      }
      router.push("/inbox");
      return;
    }

    // Demo rejim (Supabase'siz)
    setTimeout(() => router.push("/inbox"), 600);
  }

  return (
    <div>
      <h1 className={styles.title}>{t("auth.login.title")}</h1>
      <p className={styles.subtitle}>{t("auth.login.subtitle")}</p>

      <GoogleButton label={t("auth.login.googleLabel")} />
      <div className={styles.divider}>{t("auth.divider.or")}</div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="email">{t("auth.emailLabel")}</label>
          <input
            id="email"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="password">{t("auth.passwordLabel")}</label>
            <Link href="/reset">{t("auth.login.forgotPassword")}</Link>
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
          {t("auth.login.rememberMe")}
        </label>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? t("auth.login.submitting") : t("auth.login.submit")}
        </button>
      </form>

      <p className={styles.switchLine}>
        {t("auth.login.noAccount")} <Link href="/signup">{t("auth.login.signupLink")}</Link>
      </p>
    </div>
  );
}
