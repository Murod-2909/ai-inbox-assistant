"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as api from "@/lib/api";
import type { PlanTier, WorkingHours } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./ProfileTab.module.scss";

const DEFAULT_HOURS: WorkingHours = {
  enabled: false,
  start: "09:00",
  end: "18:00",
  message:
    "Assalomu alaykum! Hozir ish vaqtimiz tugagan. Ertaga siz bilan albatta bog'lanamiz.",
};

export function ProfileTab() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [hours, setHours] = useState<WorkingHours>(DEFAULT_HOURS);
  const [plan, setPlan] = useState<PlanTier>("free");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    api.fetchBusiness().then((biz) => {
      if (!active) return;
      if (biz) {
        setName(biz.name);
        setHours(biz.workingHours ?? DEFAULT_HOURS);
        setPlan(biz.plan);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const result = await api.updateBusiness({ name, workingHours: hours });
    setSaving(false);
    if (result) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (loading) {
    return <p className={styles.hint}>{t("common.loading")}</p>;
  }

  return (
    <div className={styles.card}>
      <section className={styles.section}>
        <div className={styles.rowHeader}>
          <h3>{t("settings.profile.currentPlan")}</h3>
          <span className={styles.planBadge}>{t(`plan.${plan}`)}</span>
        </div>
        {plan !== "business" && (
          <Link href="/checkout" className={styles.upgradeLink}>
            {t("settings.profile.upgradeLink")}
          </Link>
        )}
      </section>

      <section className={styles.section}>
        <h3>{t("settings.profile.businessName")}</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("settings.profile.businessNamePlaceholder")}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.rowHeader}>
          <h3>{t("settings.profile.workingHours")}</h3>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={hours.enabled}
              onChange={(e) => setHours({ ...hours, enabled: e.target.checked })}
            />
            <span className={styles.slider} />
          </label>
        </div>
        <p className={styles.hint}>{t("settings.profile.workingHoursHint")}</p>

        {hours.enabled && (
          <div className={styles.hoursGrid}>
            <label>
              {t("settings.profile.start")}
              <input
                type="time"
                value={hours.start}
                onChange={(e) => setHours({ ...hours, start: e.target.value })}
              />
            </label>
            <label>
              {t("settings.profile.end")}
              <input
                type="time"
                value={hours.end}
                onChange={(e) => setHours({ ...hours, end: e.target.value })}
              />
            </label>
            <label className={styles.fullWidth}>
              {t("settings.profile.autoReplyMessage")}
              <textarea
                rows={3}
                value={hours.message}
                onChange={(e) => setHours({ ...hours, message: e.target.value })}
              />
            </label>
          </div>
        )}
      </section>

      <div className={styles.actions}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? t("common.saving") : t("common.save")}
        </button>
        {saved && <span className={styles.savedNote}>{t("settings.profile.savedNote")}</span>}
      </div>
    </div>
  );
}
