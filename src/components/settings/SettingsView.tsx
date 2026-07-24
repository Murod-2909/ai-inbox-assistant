"use client";

import { useState } from "react";
import { ProfileTab } from "./ProfileTab";
import { TemplatesTab } from "./TemplatesTab";
import { TeamTab } from "./TeamTab";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./SettingsView.module.scss";

type Tab = "profile" | "templates" | "team";

export default function SettingsView() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("profile");

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "profile", label: t("settings.tab.profile"), icon: "🏢" },
    { key: "templates", label: t("settings.tab.templates"), icon: "⚡" },
    { key: "team", label: t("settings.tab.team"), icon: "👥" },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>{t("settings.title")}</h1>
        <p>{t("settings.subtitle")}</p>
      </header>

      <div className={styles.tabs}>
        {TABS.map((tabItem) => (
          <button
            key={tabItem.key}
            className={`${styles.tab} ${tab === tabItem.key ? styles.tabActive : ""}`}
            onClick={() => setTab(tabItem.key)}
          >
            <span>{tabItem.icon}</span> {tabItem.label}
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
