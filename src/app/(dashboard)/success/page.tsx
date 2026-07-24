"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./success.module.scss";

export default function SuccessPage() {
  const { t } = useLanguage();

  useEffect(() => {
    // Success analytics yuboring (optional)
    console.log("To'lov muvaffaqiyatli bo'ldi");
  }, []);

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.icon}>✓</div>
        <h1>{t("misc.success.title")}</h1>
        <p>{t("misc.success.subtitle")}</p>

        <div className={styles.details}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div>
              <strong>{t("misc.success.step1Title")}</strong>
              <p>{t("misc.success.step1Text")}</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div>
              <strong>{t("misc.success.step2Title")}</strong>
              <p>{t("misc.success.step2Text")}</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div>
              <strong>{t("misc.success.step3Title")}</strong>
              <p>{t("misc.success.step3Text")}</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/inbox" className={styles.primaryButton}>
            {t("misc.success.goInbox")}
          </Link>
          <Link href="/settings" className={styles.secondaryButton}>
            {t("misc.success.goSettings")}
          </Link>
        </div>

        <p className={styles.support}>
          {t("misc.success.supportPrefix")}{" "}
          <a href="mailto:support@example.com">support@example.com</a>{" "}
          {t("misc.success.supportSuffix")}
        </p>
      </div>
    </div>
  );
}
