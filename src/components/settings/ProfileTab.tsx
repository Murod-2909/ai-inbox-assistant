"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import type { WorkingHours } from "@/lib/types";
import styles from "./ProfileTab.module.scss";

const DEFAULT_HOURS: WorkingHours = {
  enabled: false,
  start: "09:00",
  end: "18:00",
  message:
    "Assalomu alaykum! Hozir ish vaqtimiz tugagan. Ertaga siz bilan albatta bog'lanamiz.",
};

export function ProfileTab() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [hours, setHours] = useState<WorkingHours>(DEFAULT_HOURS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    api.fetchBusiness().then((biz) => {
      if (!active) return;
      if (biz) {
        setName(biz.name);
        setHours(biz.workingHours ?? DEFAULT_HOURS);
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
    return <p className={styles.hint}>Yuklanmoqda...</p>;
  }

  return (
    <div className={styles.card}>
      <section className={styles.section}>
        <h3>Biznes nomi</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masalan, Gulzor Gullar Do'koni"
        />
      </section>

      <section className={styles.section}>
        <div className={styles.rowHeader}>
          <h3>Ish vaqti</h3>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={hours.enabled}
              onChange={(e) => setHours({ ...hours, enabled: e.target.checked })}
            />
            <span className={styles.slider} />
          </label>
        </div>
        <p className={styles.hint}>
          Yoqilsa, ko&apos;rsatilgan oraliqdan tashqarida kelgan xabarlarga
          avtomatik javob yuboriladi.
        </p>

        {hours.enabled && (
          <div className={styles.hoursGrid}>
            <label>
              Boshlanishi
              <input
                type="time"
                value={hours.start}
                onChange={(e) => setHours({ ...hours, start: e.target.value })}
              />
            </label>
            <label>
              Tugashi
              <input
                type="time"
                value={hours.end}
                onChange={(e) => setHours({ ...hours, end: e.target.value })}
              />
            </label>
            <label className={styles.fullWidth}>
              Avtomatik javob matni
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
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
        {saved && <span className={styles.savedNote}>Saqlandi ✓</span>}
      </div>
    </div>
  );
}
