"use client";

import { motion } from "framer-motion";
import styles from "./OrbitDiagram.module.scss";

interface OrbitItem {
  icon: React.ReactNode;
  label: string;
  status: string;
  active?: boolean;
  angle: number; // gradus, 0 = tepada, soat yo'nalishi bo'yicha
}

interface OrbitDiagramProps {
  centerIcon: React.ReactNode;
  items: OrbitItem[];
}

// Markazda mahsulot belgisi, atrofida kanal "sayyoralari" — CSS
// rotate/translate/rotate texnikasi bilan aylana bo'ylab teng joylashtiriladi
// (bubble'lar hech qachon "boshi bilan pastga" aylanmaydi).
export function OrbitDiagram({ centerIcon, items }: OrbitDiagramProps) {
  return (
    <div className={styles.orbit}>
      <div className={styles.ring} />
      <div className={styles.ringOuter} />

      <motion.div
        className={styles.center}
        animate={{ boxShadow: ["0 0 0 0 rgba(79,70,229,0.35)", "0 0 0 18px rgba(79,70,229,0)"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      >
        {centerIcon}
      </motion.div>

      {items.map((item, i) => (
        <div
          key={item.label}
          className={styles.itemSlot}
          style={{ ["--angle" as string]: `${item.angle}deg` }}
        >
          <motion.div
            className={`${styles.item} ${item.active ? styles.itemActive : ""}`}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.12 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.1 }}
          >
            <span className={styles.itemIcon}>{item.icon}</span>
          </motion.div>
          <div className={styles.itemLabel}>
            <strong>{item.label}</strong>
            <small>{item.status}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
