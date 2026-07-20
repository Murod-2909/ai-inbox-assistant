"use client";

// Parolni tiklash: email kiritiladi -> tasdiqlash ekrani.
// Xavfsizlik qoidasi: email bazada bor-yo'qligini oshkor qilmaymiz —
// har doim "yuborildi" deb ko'rsatamiz (namunalardagi standart yondashuv).
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "../auth.module.scss";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Email manzilini to'g'ri kiriting");
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
        <h2>Havola yuborildi</h2>
        <p>
          Agar <strong>{email}</strong> ro&apos;yxatdan o&apos;tgan bo&apos;lsa,
          parolni tiklash havolasi yuborildi. Pochtangizni (spam papkasini ham)
          tekshiring.
        </p>
        <Link href="/login" className={styles.submitButton}>
          Kirish sahifasiga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>Parolni tiklash</h1>
      <p className={styles.subtitle}>
        Email manzilingizni kiriting — tiklash havolasini yuboramiz
      </p>

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
        <button type="submit" className={styles.submitButton}>
          Havola yuborish
        </button>
      </form>

      <p className={styles.switchLine}>
        Esladingizmi? <Link href="/login">Kirish</Link>
      </p>
    </div>
  );
}
