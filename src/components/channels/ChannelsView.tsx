"use client";

import { useState } from "react";
import {
  TelegramIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/icons/BrandIcons";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SetupSteps } from "./SetupSteps";
import styles from "./ChannelsView.module.scss";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

export default function ChannelsView() {
  const { t } = useLanguage();
  const [botToken, setBotToken] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const [pageToken, setPageToken] = useState("");
  // Facebook va Instagram bitta Page Access Token bilan ishlaydi (Instagram
  // Business akkaunt doim Facebook Page'ga ulangan bo'ladi) — shuning uchun
  // bitta umumiy holat, lekin foydalanuvchiga tushunarli bo'lishi uchun
  // ikkita alohida karta sifatida ko'rsatamiz.
  const [metaStatus, setMetaStatus] = useState<ConnectionStatus>("disconnected");

  const STATUS_LABEL: Record<ConnectionStatus, string> = {
    connected: t("channels.status.connected"),
    connecting: t("channels.status.connecting"),
    disconnected: t("channels.status.disconnected"),
  };

  // Hozircha faqat UI — backend tayyor bo'lgach haqiqiy ulanish qo'shiladi
  function handleConnect() {
    if (!botToken.trim()) return;
    setStatus("connecting");
    setTimeout(() => setStatus("connected"), 1200);
  }

  // Haqiqiy ulanish backend/.env dagi FACEBOOK_PAGE_ACCESS_TOKEN orqali
  // (docs/meta-setup.md), bu yerda — Telegram kartasidagidek — demo ko'rinish.
  function handleMetaConnect() {
    if (!pageToken.trim()) return;
    setMetaStatus("connecting");
    setTimeout(() => setMetaStatus("connected"), 1200);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>{t("channels.title")}</h1>
        <p>{t("channels.subtitle")}</p>
      </header>

      <div className={styles.grid}>
        {/* Telegram — birinchi bosqich */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <TelegramIcon className={styles.channelIcon} />
            <div>
              <h3>{t("channel.telegram")}</h3>
              <span
                className={`${styles.status} ${
                  status === "connected" ? styles.statusOn : ""
                }`}
              >
                {STATUS_LABEL[status]}
              </span>
            </div>
          </div>

          {status !== "connected" ? (
            <>
              <SetupSteps
                steps={[
                  { icon: "🔍", text: t("channels.telegram.step1") },
                  { icon: "⌨️", text: t("channels.telegram.step2") },
                  { icon: "🔑", text: t("channels.telegram.step3") },
                ]}
              />
              <div className={styles.form}>
                <input
                  type="text"
                  placeholder={t("channels.telegram.tokenPlaceholder")}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                />
                <button
                  onClick={handleConnect}
                  disabled={!botToken.trim() || status === "connecting"}
                >
                  {status === "connecting"
                    ? t("channels.status.connecting")
                    : t("channels.connectButton")}
                </button>
              </div>
            </>
          ) : (
            <div className={styles.connectedBox}>
              {t("channels.telegram.connectedText")}
            </div>
          )}
        </div>

        {/* Facebook — asosiy ulanish shu yerda amalga oshiriladi */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FacebookIcon className={styles.channelIcon} />
            <div>
              <h3>{t("channels.facebook.title")}</h3>
              <span className={`${styles.status} ${metaStatus === "connected" ? styles.statusOn : ""}`}>
                {STATUS_LABEL[metaStatus]}
              </span>
            </div>
          </div>

          {metaStatus !== "connected" ? (
            <>
              <SetupSteps
                steps={[
                  { icon: "➕", text: t("channels.facebook.step1") },
                  { icon: "🔗", text: t("channels.facebook.step2") },
                  { icon: "🔑", text: t("channels.facebook.step3") },
                ]}
              />
              <div className={styles.form}>
                <input
                  type="text"
                  placeholder={t("channels.facebook.tokenPlaceholder")}
                  value={pageToken}
                  onChange={(e) => setPageToken(e.target.value)}
                />
                <button
                  onClick={handleMetaConnect}
                  disabled={!pageToken.trim() || metaStatus === "connecting"}
                >
                  {metaStatus === "connecting"
                    ? t("channels.status.connecting")
                    : t("channels.connectButton")}
                </button>
              </div>
              <p className={styles.hint}>{t("channels.facebook.docsHint")}</p>
            </>
          ) : (
            <div className={styles.connectedBox}>
              {t("channels.facebook.connectedText")}
            </div>
          )}
        </div>

        {/* Instagram — Facebook bilan bir xil token, alohida ulanish shart emas */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <InstagramIcon className={styles.channelIcon} />
            <div>
              <h3>{t("channel.instagram")}</h3>
              <span className={`${styles.status} ${metaStatus === "connected" ? styles.statusOn : ""}`}>
                {STATUS_LABEL[metaStatus]}
              </span>
            </div>
          </div>

          {metaStatus === "connected" ? (
            <div className={styles.connectedBox}>
              {t("channels.instagram.connectedText")}
            </div>
          ) : (
            <p className={styles.soon}>{t("channels.instagram.notConnectedText")}</p>
          )}
        </div>

        {/* Keyingi bosqichlar */}
        <div className={`${styles.card} ${styles.disabled}`}>
          <div className={styles.cardHeader}>
            <WhatsAppIcon className={styles.channelIcon} />
            <div>
              <h3>{t("channel.whatsapp")}</h3>
              <span className={styles.status}>{t("channels.status.soon")}</span>
            </div>
          </div>
          <p className={styles.soon}>{t("channels.whatsapp.soon")}</p>
        </div>
      </div>
    </div>
  );
}
