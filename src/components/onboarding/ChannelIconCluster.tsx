"use client";

import { motion } from "framer-motion";
import { TiltCard } from "@/components/animations/TiltCard";
import {
  TelegramIcon,
  WhatsAppIcon,
  InstagramIcon,
} from "@/components/icons/BrandIcons";
import styles from "./ChannelIconCluster.module.scss";

// Faqat haqiqiy (yoki tez orada qo'shiladigan) kanallar — boshqa
// hech qanday xizmat bilan integratsiya yo'q, shuning uchun soxta
// belgilar (TikTok, Viber va h.k.) qo'shilmadi.
const CHANNELS = [
  { icon: <TelegramIcon />, label: "Telegram", x: 50, y: 50, size: 64, big: true },
  { icon: <WhatsAppIcon />, label: "WhatsApp", x: 22, y: 26, size: 50 },
  { icon: <InstagramIcon />, label: "Instagram", x: 74, y: 30, size: 46 },
  { icon: "➕", label: "Tez orada", x: 50, y: 82, size: 40, faded: true },
];

export function ChannelIconCluster() {
  return (
    <TiltCard className={styles.cluster} maxTilt={8} glare>
      {CHANNELS.map((ch, i) => (
        <motion.div
          key={ch.label}
          className={`${styles.bubble} ${ch.faded ? styles.bubbleFaded : ""}`}
          style={{
            left: `${ch.x}%`,
            top: `${ch.y}%`,
            width: ch.size,
            height: ch.size,
            fontSize: ch.size * 0.42,
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: ch.faded ? 0.45 : 1,
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 0.4, delay: i * 0.08 },
            scale: { type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 },
            y: { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
          }}
          title={ch.label}
        >
          {ch.icon}
        </motion.div>
      ))}
    </TiltCard>
  );
}
