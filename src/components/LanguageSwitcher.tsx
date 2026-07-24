"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LOCALES, LOCALE_LABEL, LOCALE_SHORT } from "@/lib/i18n/locale";
import styles from "./LanguageSwitcher.module.scss";

interface Props {
  dropDirection?: "up" | "down";
}

export default function LanguageSwitcher({ dropDirection = "up" }: Props) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        title={LOCALE_LABEL[locale]}
      >
        {LOCALE_SHORT[locale]}
      </button>
      {open && (
        <div className={`${styles.menu} ${dropDirection === "down" ? styles.menuDown : ""}`}>
          {LOCALES.map((l) => (
            <button
              key={l}
              className={`${styles.option} ${l === locale ? styles.active : ""}`}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
            >
              {LOCALE_LABEL[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
