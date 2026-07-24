"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./loading.module.scss";

// Next.js App Router: sahifalar/marshrutlar orasida avtomatik ko'rsatiladi
// (Suspense chegarasi). Tezkor va yengil bo'lishi uchun faqat CSS
// animatsiyasi ishlatiladi — JS kutish shart emas.
export default function Loading() {
  const { t } = useLanguage();

  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner}>
        <div className={styles.mark}>AI</div>
        <div className={styles.ring} />
      </div>
      <p>{t("common.loading")}</p>
    </div>
  );
}
