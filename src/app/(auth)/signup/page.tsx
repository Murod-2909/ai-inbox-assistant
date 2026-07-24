"use client";

// Ro'yxatdan o'tish oqimi (namunalardan olingan qolip):
// 1-qadam: Google tugmasi tepada + bitta qisqa forma (ism, email, parol)
// 2-qadam: email tasdiqlash ekrani
// 3-qadam: onboarding — biznes nomi va turi (respond.io/crisp uslubi)
// So'ngra dashboard'ga yo'naltiriladi.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleButton from "@/components/auth/GoogleButton";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "../auth.module.scss";

type Step = "form" | "verify" | "onboarding";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("form");

  const CATEGORIES = [
    { icon: "🛍", label: t("auth.category.shop") },
    { icon: "🏥", label: t("auth.category.clinic") },
    { icon: "💇", label: t("auth.category.salon") },
    { icon: "📚", label: t("auth.category.education") },
    { icon: "", label: t("auth.category.other") },
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const found: Record<string, string> = {};
    if (name.trim().length < 2) found.name = t("auth.signup.errName");
    if (!/^\S+@\S+\.\S+$/.test(email)) found.email = t("auth.signup.errEmail");
    if (password.length < 6) found.password = t("auth.signup.errPassword");
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    // Supabase ulangan bo'lsa — haqiqiy ro'yxatdan o'tish (tasdiqlash xati yuboriladi)
    if (supabase) {
      setSubmitting(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        // full_name -> schema.sql dagi trigger operators jadvaliga yozadi
        options: { data: { full_name: name.trim() } },
      });
      setSubmitting(false);
      if (error) {
        setServerError(
          error.message === "User already registered"
            ? t("auth.signup.errUserExists")
            : t("auth.signup.errGeneric", { message: error.message }),
        );
        return;
      }
    }
    setStep("verify"); // Supabase'siz demo: xat yuborilmaydi
  }

  function finishOnboarding() {
    router.push("/inbox");
  }

  if (step === "verify") {
    return (
      <div className={styles.successState}>
        <span className={styles.successIcon}>📬</span>
        <h2>{t("auth.signup.verify.title")}</h2>
        <p>
          {t("auth.signup.verify.text", { email })}
          {!supabase && (
            <>
              <br />
              {t("auth.signup.verify.demoNote")}
            </>
          )}
        </p>
        <button
          className={styles.submitButton}
          onClick={() => setStep("onboarding")}
        >
          {t("auth.signup.verify.continue")}
        </button>
      </div>
    );
  }

  if (step === "onboarding") {
    return (
      <div>
        <div className={styles.stepIndicator}>
          <span className={styles.stepDone} />
          <span className={styles.stepDone} />
          <span />
        </div>
        <h1 className={styles.title}>{t("auth.signup.onboarding.title")}</h1>
        <p className={styles.subtitle}>{t("auth.signup.onboarding.subtitle")}</p>

        <div className={styles.field}>
          <label htmlFor="business">{t("auth.signup.onboarding.businessNameLabel")}</label>
          <input
            id="business"
            type="text"
            placeholder={t("auth.signup.onboarding.businessNamePlaceholder")}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>{t("auth.signup.onboarding.categoryLabel")}</label>
        </div>
        <div className={styles.categoryChips}>
          {CATEGORIES.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`${styles.chip} ${category === item.label ? styles.chipActive : ""}`}
              onClick={() => setCategory(item.label)}
            >
              {item.icon ? `${item.icon} ${item.label}` : item.label}
            </button>
          ))}
        </div>

        <button
          className={styles.submitButton}
          disabled={!businessName.trim() || !category}
          onClick={finishOnboarding}
        >
          {t("auth.signup.onboarding.submit")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>{t("auth.signup.title")}</h1>
      <p className={styles.subtitle}>{t("auth.signup.subtitle")}</p>

      <GoogleButton label={t("auth.signup.googleLabel")} />
      <div className={styles.divider}>{t("auth.divider.orEmail")}</div>

      {serverError && <div className={styles.errorBanner}>{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className={`${styles.field} ${errors.name ? styles.fieldError : ""}`}>
          <label htmlFor="name">{t("auth.nameLabel")}</label>
          <input
            id="name"
            type="text"
            placeholder={t("auth.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className={styles.fieldHint}>{errors.name}</span>}
        </div>

        <div className={`${styles.field} ${errors.email ? styles.fieldError : ""}`}>
          <label htmlFor="email">{t("auth.emailLabel")}</label>
          <input
            id="email"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <span className={styles.fieldHint}>{errors.email}</span>
          )}
        </div>

        <div
          className={`${styles.field} ${errors.password ? styles.fieldError : ""}`}
        >
          <label htmlFor="password">{t("auth.passwordLabel")}</label>
          <input
            id="password"
            type="password"
            placeholder={t("auth.signup.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className={styles.fieldHint}>{errors.password}</span>
          )}
        </div>

        <button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? t("auth.signup.submitting") : t("auth.signup.submit")}
        </button>
      </form>

      <p className={styles.switchLine}>
        {t("auth.signup.haveAccount")} <Link href="/login">{t("auth.signup.loginLink")}</Link>
      </p>
    </div>
  );
}
