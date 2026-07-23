"use client";

import { useState } from "react";
import {
  TelegramIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/icons/BrandIcons";
import { SetupSteps } from "./SetupSteps";
import styles from "./ChannelsView.module.scss";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

export default function ChannelsView() {
  const [botToken, setBotToken] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const [pageToken, setPageToken] = useState("");
  // Facebook va Instagram bitta Page Access Token bilan ishlaydi (Instagram
  // Business akkaunt doim Facebook Page'ga ulangan bo'ladi) — shuning uchun
  // bitta umumiy holat, lekin foydalanuvchiga tushunarli bo'lishi uchun
  // ikkita alohida karta sifatida ko'rsatamiz.
  const [metaStatus, setMetaStatus] = useState<ConnectionStatus>("disconnected");

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

  const metaStatusLabel =
    metaStatus === "connected"
      ? "Ulangan"
      : metaStatus === "connecting"
        ? "Ulanmoqda..."
        : "Ulanmagan";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Kanallar</h1>
        <p>Mijozlar yozadigan platformalarni ulang — barcha xabarlar bitta joyga tushadi.</p>
      </header>

      <div className={styles.grid}>
        {/* Telegram — birinchi bosqich */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <TelegramIcon className={styles.channelIcon} />
            <div>
              <h3>Telegram</h3>
              <span
                className={`${styles.status} ${
                  status === "connected" ? styles.statusOn : ""
                }`}
              >
                {status === "connected"
                  ? "Ulangan"
                  : status === "connecting"
                    ? "Ulanmoqda..."
                    : "Ulanmagan"}
              </span>
            </div>
          </div>

          {status !== "connected" ? (
            <>
              <SetupSteps
                steps={[
                  {
                    icon: "🔍",
                    text: (
                      <>
                        Telegram&apos;da <strong>@BotFather</strong> ga yozing
                      </>
                    ),
                  },
                  {
                    icon: "⌨️",
                    text: (
                      <>
                        <code>/newbot</code> buyrug&apos;i bilan yangi bot
                        yarating
                      </>
                    ),
                  },
                  { icon: "🔑", text: "Berilgan bot tokenini quyiga joylashtiring" },
                ]}
              />
              <div className={styles.form}>
                <input
                  type="text"
                  placeholder="Bot token (masalan: 123456:ABC-DEF...)"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                />
                <button
                  onClick={handleConnect}
                  disabled={!botToken.trim() || status === "connecting"}
                >
                  {status === "connecting" ? "Ulanmoqda..." : "Ulash"}
                </button>
              </div>
            </>
          ) : (
            <div className={styles.connectedBox}>
              ✅ Bot muvaffaqiyatli ulandi. Yangi xabarlar{" "}
              <strong>Xabarlar</strong> bo&apos;limiga tusha boshlaydi.
            </div>
          )}
        </div>

        {/* Facebook — asosiy ulanish shu yerda amalga oshiriladi */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FacebookIcon className={styles.channelIcon} />
            <div>
              <h3>Facebook Messenger</h3>
              <span className={`${styles.status} ${metaStatus === "connected" ? styles.statusOn : ""}`}>
                {metaStatusLabel}
              </span>
            </div>
          </div>

          {metaStatus !== "connected" ? (
            <>
              <SetupSteps
                steps={[
                  {
                    icon: "➕",
                    text: (
                      <>
                        <strong>developers.facebook.com</strong>&apos;da App
                        yarating
                      </>
                    ),
                  },
                  { icon: "🔗", text: "Facebook Page'ingizni ulang" },
                  { icon: "🔑", text: "Page Access Token'ni quyiga joylashtiring" },
                ]}
              />
              <div className={styles.form}>
                <input
                  type="text"
                  placeholder="Page Access Token"
                  value={pageToken}
                  onChange={(e) => setPageToken(e.target.value)}
                />
                <button
                  onClick={handleMetaConnect}
                  disabled={!pageToken.trim() || metaStatus === "connecting"}
                >
                  {metaStatus === "connecting" ? "Ulanmoqda..." : "Ulash"}
                </button>
              </div>
              <p className={styles.hint}>
                Batafsil qo&apos;llanma: <code>docs/meta-setup.md</code>
              </p>
            </>
          ) : (
            <div className={styles.connectedBox}>
              ✅ Facebook Page ulandi. Messenger xabarlari{" "}
              <strong>Xabarlar</strong> bo&apos;limiga tusha boshlaydi.
            </div>
          )}
        </div>

        {/* Instagram — Facebook bilan bir xil token, alohida ulanish shart emas */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <InstagramIcon className={styles.channelIcon} />
            <div>
              <h3>Instagram</h3>
              <span className={`${styles.status} ${metaStatus === "connected" ? styles.statusOn : ""}`}>
                {metaStatusLabel}
              </span>
            </div>
          </div>

          {metaStatus === "connected" ? (
            <div className={styles.connectedBox}>
              ✅ Instagram Facebook Page orqali avtomatik ulandi. DM xabarlari{" "}
              <strong>Xabarlar</strong> bo&apos;limiga tusha boshlaydi.
            </div>
          ) : (
            <p className={styles.soon}>
              Instagram Business akkaunt doim Facebook Page&apos;ga ulangan
              bo&apos;ladi — shuning uchun alohida ulanish shart emas.{" "}
              <strong>Facebook Messenger</strong> kartasida ulang, Instagram
              ham avtomatik yoqiladi.
            </p>
          )}
        </div>

        {/* Keyingi bosqichlar */}
        <div className={`${styles.card} ${styles.disabled}`}>
          <div className={styles.cardHeader}>
            <WhatsAppIcon className={styles.channelIcon} />
            <div>
              <h3>WhatsApp</h3>
              <span className={styles.status}>Tez orada</span>
            </div>
          </div>
          <p className={styles.soon}>WhatsApp Business API integratsiyasi keyingi bosqichda qo&apos;shiladi.</p>
        </div>
      </div>
    </div>
  );
}
