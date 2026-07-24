"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./EmptyInboxState.module.scss";

// Hali birorta ham suhbat yo'q holatda ko'rsatiladi (kanal ulanmagan yoki
// ulangan-u lekin mijozlar hali yozmagan). "Suhbat tanlang" bilan farqi —
// bu holatda tanlash uchun umuman narsa yo'q, shuning uchun keyingi
// qadamni (kanal ulash) taklif qilamiz.
export default function EmptyInboxState() {
  const { t } = useLanguage();

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.bubbleStack}>
        <span className={styles.bubbleBack} />
        <span className={styles.bubbleFront}>💬</span>
      </div>
      <h2>{t("inbox.empty.title")}</h2>
      <p>{t("inbox.empty.text")}</p>
      <Link href="/channels" className={styles.cta}>
        {t("inbox.empty.cta")}
      </Link>
    </motion.div>
  );
}
