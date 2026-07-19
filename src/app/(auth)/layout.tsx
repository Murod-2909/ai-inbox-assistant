// Auth sahifalari (login/signup/reset) uchun umumiy qobiq:
// markazda karta, tepada bosh sahifaga qaytaruvchi logo.
import Link from "next/link";
import styles from "./auth.module.scss";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.shell}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoMark}>AI</span> Inbox Assistant
      </Link>
      <div className={styles.card}>{children}</div>
      <p className={styles.demoNote}>
        Demo rejim — haqiqiy autentifikatsiya Supabase ulangach ishlaydi
      </p>
    </div>
  );
}
