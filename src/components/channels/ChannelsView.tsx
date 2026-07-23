"use client";

import { useState } from "react";
import styles from "./ChannelsView.module.scss";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

export default function ChannelsView() {
  const [botToken, setBotToken] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const [pageToken, setPageToken] = useState("");
  const [metaStatus, setMetaStatus] = useState<ConnectionStatus>("disconnected");

  // Hozircha faqat UI — backend tayyor bo'lgach haqiqiy ulanish qo'shiladi
  function handleConnect() {
    if (!botToken.trim()) return;
    setStatus("connecting");
    setTimeout(() => setStatus("connected"), 1200);
  }

  // Facebook Page + unga ulangan Instagram — bitta token ikkalasini ham yoqadi.
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
        <h1>Kanallar</h1>
        <p>Mijozlar yozadigan platformalarni ulang — barcha xabarlar bitta joyga tushadi.</p>
      </header>

      <div className={styles.grid}>
        {/* Telegram — birinchi bosqich */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={`${styles.channelIcon} ${styles.telegram}`}>✈️</span>
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
              <ol className={styles.steps}>
                <li>
                  Telegram&apos;da <strong>@BotFather</strong> ga yozing
                </li>
                <li>
                  <code>/newbot</code> buyrug&apos;i bilan yangi bot yarating
                </li>
                <li>Berilgan bot tokenini quyiga joylashtiring</li>
              </ol>
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

        {/* Facebook + Instagram — bitta Meta Page token ikkalasini ham yoqadi */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={`${styles.channelIcon} ${styles.meta}`}>📘</span>
            <div>
              <h3>Facebook va Instagram</h3>
              <span
                className={`${styles.status} ${
                  metaStatus === "connected" ? styles.statusOn : ""
                }`}
              >
                {metaStatus === "connected"
                  ? "Ulangan"
                  : metaStatus === "connecting"
                    ? "Ulanmoqda..."
                    : "Ulanmagan"}
              </span>
            </div>
          </div>

          {metaStatus !== "connected" ? (
            <>
              <ol className={styles.steps}>
                <li>
                  <strong>developers.facebook.com</strong>&apos;da App yarating
                </li>
                <li>Facebook Page&apos;ingizni ulang (Instagram shu Page&apos;ga bog&apos;langan bo&apos;lsin)</li>
                <li>Page Access Token&apos;ni quyiga joylashtiring</li>
              </ol>
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
                Batafsil qo&apos;llanma:{" "}
                <code>docs/meta-setup.md</code>
              </p>
            </>
          ) : (
            <div className={styles.connectedBox}>
              ✅ Facebook va Instagram ulandi. Ikkala kanaldan kelgan xabarlar{" "}
              <strong>Xabarlar</strong> bo&apos;limiga tusha boshlaydi.
            </div>
          )}
        </div>

        {/* Keyingi bosqichlar */}
        <div className={`${styles.card} ${styles.disabled}`}>
          <div className={styles.cardHeader}>
            <span className={`${styles.channelIcon} ${styles.whatsapp}`}>💚</span>
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
