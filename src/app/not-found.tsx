"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./not-found.module.scss";

// Global 404 — Next.js App Router har qanday mos kelmagan marshrut uchun
// avtomatik shu faylni ko'rsatadi. Login holatini bilmaymiz (bu sahifa
// himoyalanmagan qatlamda), shuning uchun faqat umumiy havolalar beriladi.
export default function NotFound() {
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
        <h2>Sahifa topilmadi</h2>
        <p>
          Qidirilayotgan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi
          mumkin.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Bosh sahifaga qaytish
          </Link>
          <Link href="/inbox" className={styles.ghostButton}>
            Inbox&apos;ga o&apos;tish
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
