"use client";

// Tahlil sahifasi: backend /api/stats dan haqiqiy agregatlar,
// backend o'chiq bo'lsa — namunaviy (mock) ko'rsatkichlar.
import { useEffect, useState } from "react";
import type { Stats } from "@/lib/types";
import { fetchStats, reportExportUrl } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./AnalyticsView.module.scss";

const DAY_KEYS = [
  "analytics.day.sun",
  "analytics.day.mon",
  "analytics.day.tue",
  "analytics.day.wed",
  "analytics.day.thu",
  "analytics.day.fri",
  "analytics.day.sat",
];

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

export default function AnalyticsView() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isMock, setIsMock] = useState(false);

  const EXPORT_OPTIONS: { period: "week" | "month"; format: "xlsx" | "docx"; label: string }[] = [
    { period: "week", format: "xlsx", label: t("analytics.export.weekExcel") },
    { period: "week", format: "docx", label: t("analytics.export.weekWord") },
    { period: "month", format: "xlsx", label: t("analytics.export.monthExcel") },
    { period: "month", format: "docx", label: t("analytics.export.monthWord") },
  ];

  const INTENT_LABELS: Record<string, string> = {
    question: t("analytics.intent.question"),
    order: t("analytics.intent.order"),
    feedback: t("analytics.intent.feedback"),
    complaint: t("analytics.intent.complaint"),
    other: t("analytics.intent.other"),
  };

  /** Oxirgi 7 kunni {label, count} ko'rinishida tayyorlaydi (bo'sh kunlar 0). */
  function buildWeek(week: Record<string, number>): { day: string; count: number }[] {
    const days: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
      days.push({ day: t(DAY_KEYS[date.getDay()]), count: week[key] ?? 0 });
    }
    return days;
  }

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
    return <div className={styles.page}>{t("common.loading")}</div>;
  }

  const sentiment = [
    { key: "positive", label: t("analytics.sentiment.positive"), icon: "😊", count: stats.sentiment.positive },
    { key: "neutral", label: t("analytics.sentiment.neutral"), icon: "😐", count: stats.sentiment.neutral },
    { key: "negative", label: t("analytics.sentiment.negative"), icon: "😠", count: stats.sentiment.negative },
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

  const mockDayOrder = [1, 2, 3, 4, 5, 6, 0]; // Du..Sha, Ya (Monday-first)
  const week = isMock
    ? [14, 18, 11, 22, 19, 8, 24].map((count, i) => ({
        day: t(DAY_KEYS[mockDayOrder[i]]),
        count,
      }))
    : buildWeek(stats.week);
  const maxWeek = Math.max(1, ...week.map((d) => d.count));

  const cards = [
    { label: t("analytics.card.todayMessages"), value: String(stats.todayMessages) },
    { label: t("analytics.card.unanswered"), value: String(stats.unanswered) },
    {
      label: t("analytics.card.avgResponse"),
      value:
        stats.avgResponseMinutes === null
          ? "—"
          : `${stats.avgResponseMinutes} ${t("analytics.card.avgResponseUnit")}`,
    },
    { label: t("analytics.card.aiAnalyses"), value: String(sentimentTotal) },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1>{t("analytics.title")}</h1>
            <p>
              {isMock ? t("analytics.subtitle.mock") : t("analytics.subtitle.live")}
            </p>
          </div>
          {!isMock && (
            <div className={styles.exportGroup}>
              {EXPORT_OPTIONS.map((opt) => (
                <a
                  key={`${opt.period}-${opt.format}`}
                  className={styles.exportButton}
                  href={reportExportUrl(opt.period, opt.format)}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          )}
        </div>
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
          <h2>{t("analytics.sentiment.title")}</h2>
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
          <h2>{t("analytics.intent.title")}</h2>
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
          <h2>{t("analytics.week.title")}</h2>
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
