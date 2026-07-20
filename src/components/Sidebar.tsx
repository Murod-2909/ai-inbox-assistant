"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "./ThemeToggle";
import styles from "./Sidebar.module.scss";

const navItems = [
  { href: "/inbox", label: "Xabarlar", icon: "💬" },
  { href: "/channels", label: "Kanallar", icon: "🔌" },
  { href: "/analytics", label: "Tahlil", icon: "📊" },
  { href: "/settings", label: "Sozlamalar", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  // Supabase sessiyasini kuzatamiz: kim kirgan bo'lsa ismini ko'rsatamiz
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      setUserName(user ? (user.user_metadata?.full_name as string) || user.email || "Operator" : null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setUserName(user ? (user.user_metadata?.full_name as string) || user.email || "Operator" : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    // Sessiyani tozalab, login sahifasiga yo'naltiramiz
    await supabase?.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>AI</span>
        <span>Inbox Assistant</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${
              pathname.startsWith(item.href) ? styles.active : ""
            }`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.business}>
          <div className={styles.avatar}>
            {(userName ?? "D").charAt(0).toUpperCase()}
          </div>
          <div className={styles.businessInfo}>
            <div className={styles.businessName}>{userName ?? "Demo biznes"}</div>
            <div className={styles.businessPlan}>Bepul tarif</div>
          </div>
          {userName && (
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              title="Chiqish"
            >
              ⎋
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
