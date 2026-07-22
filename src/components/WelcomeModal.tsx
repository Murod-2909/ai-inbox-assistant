"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./WelcomeModal.module.scss";

const STORAGE_KEY = "ai-inbox-welcome-seen";

const FEATURE_CHIPS = [
  { icon: "📥", label: "Yagona inbox" },
  { icon: "🧠", label: "AI tahlil" },
  { icon: "✨", label: "Javob taklifi" },
  { icon: "🎤", label: "Media va ovoz" },
  { icon: "📊", label: "Jonli statistika" },
  { icon: "⚡", label: "Tezkor shablonlar" },
];

// Login/ro'yxatdan o'tishdan keyin bir marta ko'rsatiladigan xush kelibsiz oynasi.
// Fabrikatsiya qilingan "asoschi videosi" o'rniga o'zimizning haqiqiy mahsulot
// oqimini animatsion tarzda ko'rsatamiz (soxta odam/sharh yo'q).
export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    } catch {
      // localStorage yo'q (masalan SSR yoki bloklangan) — modal ko'rsatilmaydi
    }
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // e'tiborsiz qoldiramiz — keyingi safar qayta ko'rsatiladi, xato emas
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.close} onClick={dismiss} aria-label="Yopish">
              ✕
            </button>

            <div className={styles.left}>
              <h2>Xush kelibsiz, AI Inbox Assistant&apos;ga! 🎉</h2>
              <p>
                Barcha mijoz xabarlaringiz endi bitta joyda — AI tahlili va
                tayyor javob takliflari bilan.
              </p>

              <div className={styles.chips}>
                {FEATURE_CHIPS.map((f) => (
                  <div key={f.label} className={styles.chip}>
                    <span>{f.icon}</span>
                    {f.label}
                  </div>
                ))}
              </div>

              <button className={styles.cta} onClick={dismiss}>
                Ishga tushirish
              </button>
            </div>

            <div className={styles.right}>
              <DemoPreview />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// O'ng paneldagi animatsion demo: mijoz xabari → AI tahlili → javob yuborildi.
// Halqa aylanib takrorlanadi, video o'rniga real mahsulot oqimini ko'rsatadi.
function DemoPreview() {
  const [step, setStep] = useState(0);
  const steps = 3;

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % steps), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.demo}>
      <motion.div
        className={styles.demoBubble}
        initial={false}
        animate={{ opacity: step >= 0 ? 1 : 0, y: step >= 0 ? 0 : 8 }}
        transition={{ duration: 0.3 }}
      >
        Buyurtmam qachon yetib keladi?
      </motion.div>

      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            className={styles.demoAnalysis}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span>❓ Savol</span>
            <span>😐 Neytral</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            className={styles.demoReply}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            ✨ &quot;Buyurtmangiz ertaga yetkaziladi — kuzatuv raqamini
            yubordim!&quot;
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
