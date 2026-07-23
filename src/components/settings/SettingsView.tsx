"use client";

import { useState } from "react";
import { ProfileTab } from "./ProfileTab";
import { TemplatesTab } from "./TemplatesTab";
import { TeamTab } from "./TeamTab";
import styles from "./SettingsView.module.scss";

type Tab = "profile" | "templates" | "team";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "profile", label: "Profil", icon: "🏢" },
  { key: "templates", label: "Shablonlar", icon: "⚡" },
  { key: "team", label: "Jamoa", icon: "👥" },
];

export default function SettingsView() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Sozlamalar</h1>
        <p>Biznes profili, javob shablonlari va jamoa a&apos;zolarini boshqaring.</p>
      </header>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ""}`}
            onClick={() => setTab(t.key)}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === "profile" && <ProfileTab />}
        {tab === "templates" && <TemplatesTab />}
        {tab === "team" && <TeamTab />}
      </div>
    </div>
  );
}
