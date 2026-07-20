"use client";

import { motion } from "framer-motion";

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
}

export function FloatingElement({ children, delay = 0, duration = 4, distance = 20 }: FloatingElementProps) {
  return (
    <motion.div
      animate={{ y: [0, -distance, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
