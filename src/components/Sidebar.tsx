"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
          <div className={styles.avatar}>D</div>
          <div className={styles.businessInfo}>
            <div className={styles.businessName}>Demo biznes</div>
            <div className={styles.businessPlan}>Bepul tarif</div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
