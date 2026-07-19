"use client";

import { useState } from "react";
import styles from "./ChannelsView.module.scss";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

export default function ChannelsView() {
  const [botToken, setBotToken] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  // Hozircha faqat UI — backend tayyor bo'lgach haqiqiy ulanish qo'shiladi
  function handleConnect() {
    if (!botToken.trim()) return;
    setStatus("connecting");
    setTimeout(() => setStatus("connected"), 1200);
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

        <div className={`${styles.card} ${styles.disabled}`}>
          <div className={styles.cardHeader}>
            <span className={`${styles.channelIcon} ${styles.instagram}`}>📸</span>
            <div>
              <h3>Instagram</h3>
              <span className={styles.status}>Tez orada</span>
            </div>
          </div>
          <p className={styles.soon}>Instagram Direct integratsiyasi keyingi bosqichda qo&apos;shiladi.</p>
        </div>
      </div>
    </div>
  );
}
