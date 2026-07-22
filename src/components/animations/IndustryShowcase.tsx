"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./IndustryShowcase.module.scss";

interface Industry {
  icon: string;
  title: string;
  subtitle: string;
  detail: string;
}

interface IndustryShowcaseProps {
  items: Industry[];
}

// Chapda soha ro'yxati, o'ngda tanlangan soha uchun kengaytirilgan karta —
// hover/bosishda almashadi (crossfade bilan).
export function IndustryShowcase({ items }: IndustryShowcaseProps) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className={styles.showcase}>
      <div className={styles.list}>
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            className={`${styles.listItem} ${i === active ? styles.listItemActive : ""}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <span className={styles.listIcon}>{item.icon}</span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </span>
          </button>
        ))}
      </div>

      <div className={styles.previewWrap}>
        <AnimatePresence>
          <motion.div
            key={current.title}
            className={styles.preview}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.previewIcon}>{current.icon}</span>
            <strong>{current.title} uchun moslashtirilgan</strong>
            <p>{current.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
