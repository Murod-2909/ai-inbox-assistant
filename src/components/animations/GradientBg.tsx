"use client";

import { motion } from "framer-motion";
import styles from "./GradientBg.module.scss";

export function GradientBg() {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.gradient}
        animate={{
          background: [
            "linear-gradient(45deg, #4f46e5 0%, #818cf8 50%, #c7d2fe 100%)",
            "linear-gradient(135deg, #818cf8 0%, #4f46e5 50%, #312e81 100%)",
            "linear-gradient(225deg, #c7d2fe 0%, #818cf8 50%, #4f46e5 100%)",
            "linear-gradient(45deg, #4f46e5 0%, #818cf8 50%, #c7d2fe 100%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <div className={styles.overlay} />
    </div>
  );
}
