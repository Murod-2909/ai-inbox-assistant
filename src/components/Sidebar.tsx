"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { fetchBusiness } from "@/lib/api";
import type { PlanTier } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [userName, setUserName] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanTier>("free");

  const navItems = [
    { href: "/inbox", label: t("nav.inbox"), icon: "💬" },
    { href: "/channels", label: t("nav.channels"), icon: "🔌" },
    { href: "/analytics", label: t("nav.analytics"), icon: "📊" },
    { href: "/settings", label: t("nav.settings"), icon: "⚙️" },
  ];

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

  useEffect(() => {
    fetchBusiness().then((biz) => {
      if (biz) setPlan(biz.plan);
    });
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
            <div className={styles.businessName}>{userName ?? t("nav.defaultBusiness")}</div>
            <div className={styles.businessPlan}>
              {t("nav.planLabel", { plan: t(`plan.${plan}`) })}
            </div>
          </div>
          {userName && (
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              title={t("nav.logout")}
            >
              ⎋
            </button>
          )}
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
