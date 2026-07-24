"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as api from "@/lib/api";
import type { TeamMember } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./TeamTab.module.scss";

export function TeamTab() {
  const { t } = useLanguage();
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [operatorLimit, setOperatorLimit] = useState<number | null>(1);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invited, setInvited] = useState<string | null>(null);

  const ROLE_LABEL: Record<TeamMember["role"], string> = {
    owner: t("settings.team.role.owner"),
    operator: t("settings.team.role.operator"),
  };

  const STATUS_LABEL: Record<TeamMember["status"], string> = {
    available: t("settings.team.status.available"),
    busy: t("settings.team.status.busy"),
    offline: t("settings.team.status.offline"),
  };

  useEffect(() => {
    Promise.all([api.fetchTeam(), api.fetchBusiness()]).then(([list, biz]) => {
      setMembers(list);
      if (biz) setOperatorLimit(biz.operatorLimit);
      setLoading(false);
    });
  }, []);

  const atLimit =
    members !== null && operatorLimit !== null && members.length >= operatorLimit;

  async function handleInvite() {
    if (!email.trim() || atLimit) return;
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
      setError(t("settings.team.inviteError"));
    }
  }

  if (loading) {
    return <p className={styles.hint}>{t("common.loading")}</p>;
  }

  if (members === null) {
    return (
      <div className={styles.card}>
        <p className={styles.hint}>{t("settings.team.demoOnly")}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.rowHeader}>
          <h3>{t("settings.team.inviteTitle")}</h3>
          <span className={styles.usage}>
            {t("settings.team.usage", {
              count: members.length,
              limit: operatorLimit ?? "∞",
            })}
          </span>
        </div>

        {atLimit ? (
          <p className={styles.limitNote}>
            {t("settings.team.limitReached")}{" "}
            <Link href="/checkout">{t("settings.team.upgradeLink")}</Link>
          </p>
        ) : (
          <div className={styles.form}>
            <input
              type="email"
              placeholder={t("settings.team.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder={t("settings.team.namePlaceholder")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <button onClick={handleInvite} disabled={inviting || !email.trim()}>
              {inviting ? t("common.sending") : t("settings.team.inviteButton")}
            </button>
            {invited && (
              <p className={styles.success}>
                {t("settings.team.inviteSuccess", { email: invited })}
              </p>
            )}
            {error && <p className={styles.error}>{error}</p>}
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h3>{t("settings.team.membersTitle")}</h3>
        {members.length === 0 && (
          <p className={styles.hint}>{t("settings.team.onlyYou")}</p>
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
