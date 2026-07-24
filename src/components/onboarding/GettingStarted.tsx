"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { ChannelIconCluster } from "./ChannelIconCluster";
import styles from "./GettingStarted.module.scss";

const STORAGE_KEY = "ai-inbox-onboarding-done";

interface Task {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  comingSoon?: boolean;
}

export function GettingStarted({ name }: { name?: string }) {
  const { t } = useLanguage();
  const [done, setDone] = useState<Set<string>>(new Set());

  // Faqat mahsulotda haqiqatan mavjud (yoki Sozlamalar sahifasida rejalashtirilgan)
  // vazifalar — soxta "Lifecycle" yoki boshqa ishlamaydigan funksiyalar yo'q.
  const TASKS: Task[] = [
    {
      id: "channel",
      title: t("misc.onboarding.task.channel.title"),
      description: t("misc.onboarding.task.channel.description"),
      cta: t("misc.onboarding.task.channel.cta"),
      href: "/channels",
    },
    {
      id: "ai",
      title: t("misc.onboarding.task.ai.title"),
      description: t("misc.onboarding.task.ai.description"),
      cta: t("misc.onboarding.task.ai.cta"),
      href: "/inbox",
    },
    {
      id: "templates",
      title: t("misc.onboarding.task.templates.title"),
      description: t("misc.onboarding.task.templates.description"),
      cta: t("misc.onboarding.task.templates.cta"),
      href: "/settings",
    },
    {
      id: "team",
      title: t("misc.onboarding.task.team.title"),
      description: t("misc.onboarding.task.team.description"),
      cta: t("channels.status.soon"),
      href: "/settings",
      comingSoon: true,
    },
  ];

  const [openId, setOpenId] = useState<string>(TASKS[0].id);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(new Set(JSON.parse(raw)));
    } catch {
      // localStorage yo'q — hisob shunchaki 0 dan boshlanadi
    }
  }, []);

  function markDone(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // e'tiborsiz qoldiramiz
      }
      return next;
    });
  }

  const progress = done.size;

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1>{t("misc.onboarding.greeting", { name: name || t("misc.onboarding.defaultName") })}</h1>
          <div className={styles.progress}>
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${(progress / TASKS.length) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span>
              {progress} / {TASKS.length}
            </span>
          </div>
        </div>

        <div className={styles.list}>
          {TASKS.map((task) => {
            const isOpen = openId === task.id;
            const isDone = done.has(task.id);
            return (
              <div key={task.id} className={styles.item}>
                <button
                  className={styles.itemHeader}
                  onClick={() => setOpenId(isOpen ? "" : task.id)}
                >
                  <span className={`${styles.check} ${isDone ? styles.checkDone : ""}`}>
                    {isDone ? "✓" : ""}
                  </span>
                  <span className={styles.itemTitle}>{task.title}</span>
                  <motion.span
                    className={styles.chevron}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ⌄
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className={styles.itemBody}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className={styles.itemBodyInner}>
                        <div className={styles.itemText}>
                          <p>{task.description}</p>
                          {task.comingSoon ? (
                            <span className={styles.soonBadge}>{task.cta}</span>
                          ) : (
                            <Link
                              href={task.href}
                              className={styles.itemCta}
                              onClick={() => markDone(task.id)}
                            >
                              {task.cta}
                            </Link>
                          )}
                        </div>
                        {task.id === "channel" && (
                          <div className={styles.itemVisual}>
                            <ChannelIconCluster />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Link href="/inbox" className={styles.skip}>
          {t("misc.onboarding.skipToInbox")}
        </Link>
      </div>

      <aside className={styles.sidebar}>
        <h2>{t("misc.onboarding.resourcesTitle")}</h2>
        <a href="mailto:support@example.com" className={styles.resource}>
          <span>💬</span> {t("misc.onboarding.contactSupport")}
        </a>
        <Link href="/inbox" className={styles.resource}>
          <span>🎬</span> {t("misc.onboarding.viewDemo")}
        </Link>
      </aside>
    </div>
  );
}
