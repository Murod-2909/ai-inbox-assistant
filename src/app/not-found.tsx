"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./not-found.module.scss";

// Global 404 — Next.js App Router har qanday mos kelmagan marshrut uchun
// avtomatik shu faylni ko'rsatadi. Login holatini bilmaymiz (bu sahifa
// himoyalanmagan qatlamda), shuning uchun faqat umumiy havolalar beriladi.
export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className={styles.bubbleStack}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className={styles.bubbleBack} />
          <span className={styles.bubbleFront}>?</span>
        </motion.div>

        <h1>404</h1>
        <h2>{t("misc.notFound.title")}</h2>
        <p>{t("misc.notFound.text")}</p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            {t("misc.notFound.home")}
          </Link>
          <Link href="/inbox" className={styles.ghostButton}>
            {t("misc.notFound.inbox")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
