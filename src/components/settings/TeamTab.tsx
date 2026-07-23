"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import type { TeamMember } from "@/lib/types";
import styles from "./TeamTab.module.scss";

const ROLE_LABEL: Record<TeamMember["role"], string> = {
  owner: "Egasi",
  operator: "Operator",
};

const STATUS_LABEL: Record<TeamMember["status"], string> = {
  available: "Faol",
  busy: "Band",
  offline: "Oflayn",
};

export function TeamTab() {
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invited, setInvited] = useState<string | null>(null);

  useEffect(() => {
    api.fetchTeam().then((list) => {
      setMembers(list);
      setLoading(false);
    });
  }, []);

  async function handleInvite() {
    if (!email.trim()) return;
    setInviting(true);
    setError(null);
    setInvited(null);
    const result = await api.inviteTeamMember(email.trim(), fullName.trim() || undefined);
    setInviting(false);
    if (result) {
      setInvited(result.email);
      setEmail("");
      setFullName("");
    } else {
      setError("Taklif yuborilmadi. Email manzilni tekshiring yoki keyinroq urinib ko'ring.");
    }
  }

  if (loading) {
    return <p className={styles.hint}>Yuklanmoqda...</p>;
  }

  if (members === null) {
    return (
      <div className={styles.card}>
        <p className={styles.hint}>
          Jamoa funksiyasi faqat Supabase ulanganda ishlaydi. Hozircha demo
          rejimda ishlayapsiz.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h3>Jamoaga taklif qilish</h3>
        <div className={styles.form}>
          <input
            type="email"
            placeholder="email@misol.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Ismi (ixtiyoriy)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <button onClick={handleInvite} disabled={inviting || !email.trim()}>
            {inviting ? "Yuborilmoqda..." : "Taklif yuborish"}
          </button>
          {invited && (
            <p className={styles.success}>{invited} manziliga taklif yuborildi ✓</p>
          )}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>

      <div className={styles.card}>
        <h3>Jamoa a&apos;zolari</h3>
        {members.length === 0 && (
          <p className={styles.hint}>Hozircha faqat siz bor ekansiz.</p>
        )}
        <ul className={styles.list}>
          {members.map((m) => (
            <li key={m.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={`${styles.dot} ${styles[`dot_${m.status}`]}`} />
                <div>
                  <strong>{m.fullName}</strong>
                  <p>{STATUS_LABEL[m.status]}</p>
                </div>
              </div>
              <span className={styles.role}>{ROLE_LABEL[m.role]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
