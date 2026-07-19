"use client";

// Tahlil sahifasi: backend /api/stats dan haqiqiy agregatlar,
// backend o'chiq bo'lsa — namunaviy (mock) ko'rsatkichlar.
import { useEffect, useState } from "react";
import type { Stats } from "@/lib/types";
import { fetchStats } from "@/lib/api";
import styles from "./AnalyticsView.module.scss";

const INTENT_LABELS: Record<string, string> = {
  question: "Savol",
  order: "Buyurtma",
  feedback: "Fikr",
  complaint: "Shikoyat",
  other: "Boshqa",
};

// getDay(): 0 = yakshanba ... 6 = shanba
const DAY_LABELS = ["Ya", "Du", "Se", "Cho", "Pa", "Ju", "Sha"];

const MOCK_STATS: Stats = {
  todayMessages: 24,
  unanswered: 3,
  avgResponseMinutes: 4,
  sentiment: { positive: 11, neutral: 9, negative: 4 },
  intents: [
    { intent: "question", count: 10 },
    { intent: "order", count: 7 },
    { intent: "feedback", count: 4 },
    { intent: "complaint", count: 2 },
    { intent: "other", count: 1 },
  ],
  week: {},
};

/** Oxirgi 7 kunni {label, count} ko'rinishida tayyorlaydi (bo'sh kunlar 0). */
function buildWeek(week: Record<string, number>): { day: string; count: number }[] {
  const days: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
    days.push({ day: DAY_LABELS[date.getDay()], count: week[key] ?? 0 });
  }
  return days;
}

export default function AnalyticsView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    fetchStats().then((fresh) => {
      if (fresh) {
        setStats(fresh);
      } else {
        setStats(MOCK_STATS);
        setIsMock(true);
      }
    });
  }, []);

  if (!stats) {
    return <div className={styles.page}>Yuklanmoqda...</div>;
  }

  const sentiment = [
    { key: "positive", label: "Ijobiy", icon: "😊", count: stats.sentiment.positive },
    { key: "neutral", label: "Neytral", icon: "😐", count: stats.sentiment.neutral },
    { key: "negative", label: "Salbiy", icon: "😠", count: stats.sentiment.negative },
  ] as const;
  const sentimentTotal = Math.max(
    1,
    sentiment.reduce((sum, s) => sum + s.count, 0),
  );

  const intents = stats.intents.map((item) => ({
    label: INTENT_LABELS[item.intent] ?? item.intent,
    count: item.count,
  }));
  const maxIntent = Math.max(1, ...intents.map((i) => i.count));

  const week = isMock
    ? [14, 18, 11, 22, 19, 8, 24].map((count, i) => ({
        day: ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"][i],
        count,
      }))
    : buildWeek(stats.week);
  const maxWeek = Math.max(1, ...week.map((d) => d.count));

  const cards = [
    { label: "Bugungi xabarlar", value: String(stats.todayMessages) },
    { label: "Javob kutmoqda", value: String(stats.unanswered) },
    {
      label: "O'rtacha javob vaqti",
      value:
        stats.avgResponseMinutes === null
          ? "—"
          : `${stats.avgResponseMinutes} daq`,
    },
    { label: "AI tahlillar", value: String(sentimentTotal) },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Tahlil</h1>
        <p>
          {isMock
            ? "Namunaviy ma'lumotlar (backend ulanmagan)"
            : "Jonli ko'rsatkichlar — bazadagi haqiqiy ma'lumotlardan"}
        </p>
      </header>

      <div className={styles.statGrid}>
        {cards.map((card) => (
          <div key={card.label} className={styles.statCard}>
            <div className={styles.statLabel}>{card.label}</div>
            <div className={styles.statValue}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.chartGrid}>
        <section className={styles.card}>
          <h2>Mijozlar kayfiyati</h2>
          <div className={styles.stackedBar}>
            {sentiment.map(
              (s) =>
                s.count > 0 && (
                  <div
                    key={s.key}
                    className={`${styles.segment} ${styles[s.key]}`}
                    style={{ flexGrow: s.count }}
                  />
                ),
            )}
          </div>
          <div className={styles.legend}>
            {sentiment.map((s) => (
              <div key={s.key} className={styles.legendItem}>
                <span className={`${styles.swatch} ${styles[s.key]}`} />
                <span>
                  {s.icon} {s.label}
                </span>
                <strong>
                  {s.count} ({Math.round((s.count / sentimentTotal) * 100)}%)
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2>Murojaat turlari</h2>
          <div className={styles.intentRows}>
            {intents.map((intent) => (
              <div key={intent.label} className={styles.intentRow}>
                <span className={styles.intentLabel}>{intent.label}</span>
                <div className={styles.intentTrack}>
                  <div
                    className={styles.intentBar}
                    style={{ width: `${(intent.count / maxIntent) * 100}%` }}
                  />
                </div>
                <span className={styles.intentValue}>{intent.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.card} ${styles.wide}`}>
          <h2>Haftalik xabarlar hajmi</h2>
          <div className={styles.columns}>
            {week.map((d, index) => (
              <div key={`${d.day}-${index}`} className={styles.column}>
                <div className={styles.columnValue}>{d.count}</div>
                <div className={styles.columnTrack}>
                  <div
                    className={styles.columnBar}
                    style={{ height: `${(d.count / maxWeek) * 100}%` }}
                  />
                </div>
                <div className={styles.columnDay}>{d.day}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
