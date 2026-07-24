"use client";

// Parolni tiklash: email kiritiladi -> tasdiqlash ekrani.
// Xavfsizlik qoidasi: email bazada bor-yo'qligini oshkor qilmaymiz —
// har doim "yuborildi" deb ko'rsatamiz (namunalardagi standart yondashuv).
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "../auth.module.scss";

export default function ResetPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(t("auth.reset.errInvalid"));
      return;
    }
    setError("");

    if (supabase) {
      // Natijadan qat'i nazar "yuborildi" deymiz — email bazada bor-yo'qligini
      // oshkor qilmaslik uchun (xatoni ham yutamiz)
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.successState}>
        <span className={styles.successIcon}>🔑</span>
        <h2>{t("auth.reset.sent.title")}</h2>
        <p>{t("auth.reset.sent.text", { email })}</p>
        <Link href="/login" className={styles.submitButton}>
          {t("auth.reset.backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>{t("auth.reset.title")}</h1>
      <p className={styles.subtitle}>{t("auth.reset.subtitle")}</p>

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
        <button type="submit" className={styles.submitButton}>
          {t("auth.reset.submit")}
        </button>
      </form>

      <p className={styles.switchLine}>
        {t("auth.reset.rememberedIt")} <Link href="/login">{t("auth.login.submit")}</Link>
      </p>
    </div>
  );
}
