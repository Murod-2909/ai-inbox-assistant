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
import styles from "../auth.module.scss";

type Step = "form" | "verify" | "onboarding";

const CATEGORIES = ["🛍 Do'kon", "🏥 Klinika", "💇 Salon", "📚 O'quv markazi", "Boshqa"];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");

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
    if (name.trim().length < 2) found.name = "Ismingizni kiriting";
    if (!/^\S+@\S+\.\S+$/.test(email)) found.email = "Email noto'g'ri formatda";
    if (password.length < 6) found.password = "Parol kamida 6 belgi bo'lsin";
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
            ? "Bu email allaqachon ro'yxatdan o'tgan — Kirish sahifasidan foydalaning"
            : "Ro'yxatdan o'tishda xatolik: " + error.message,
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
        <h2>Emailingizni tekshiring</h2>
        <p>
          <strong>{email}</strong> manziliga tasdiqlash havolasi yubordik.
          Havolani bosganingizdan so&apos;ng hisobingiz faollashadi.
          <br />
          (Demo rejim — hozircha xat yuborilmaydi)
        </p>
        <button
          className={styles.submitButton}
          onClick={() => setStep("onboarding")}
        >
          Tasdiqladim — davom etish
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
        <h1 className={styles.title}>Biznesingiz haqida</h1>
        <p className={styles.subtitle}>
          Dashboard&apos;ni sizga moslashtirishimiz uchun bir daqiqa
        </p>

        <div className={styles.field}>
          <label htmlFor="business">Biznes nomi</label>
          <input
            id="business"
            type="text"
            placeholder="Masalan: Go'zallik saloni «Nilufar»"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Faoliyat turi</label>
        </div>
        <div className={styles.categoryChips}>
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={`${styles.chip} ${category === item ? styles.chipActive : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className={styles.submitButton}
          disabled={!businessName.trim() || !category}
          onClick={finishOnboarding}
        >
          Dashboard&apos;ga o&apos;tish →
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>Hisob yarating</h1>
      <p className={styles.subtitle}>
        Bepul boshlang — karta talab qilinmaydi
      </p>

      <GoogleButton label="Google bilan davom etish" />
      <div className={styles.divider}>yoki email bilan</div>

      {serverError && <div className={styles.errorBanner}>{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className={`${styles.field} ${errors.name ? styles.fieldError : ""}`}>
          <label htmlFor="name">Ismingiz</label>
          <input
            id="name"
            type="text"
            placeholder="Aziza Karimova"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className={styles.fieldHint}>{errors.name}</span>}
        </div>

        <div className={`${styles.field} ${errors.email ? styles.fieldError : ""}`}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="siz@biznes.uz"
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
          <label htmlFor="password">Parol</label>
          <input
            id="password"
            type="password"
            placeholder="Kamida 6 belgi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className={styles.fieldHint}>{errors.password}</span>
          )}
        </div>

        <button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
        </button>
      </form>

      <p className={styles.switchLine}>
        Hisobingiz bormi? <Link href="/login">Kirish</Link>
      </p>
    </div>
  );
}
