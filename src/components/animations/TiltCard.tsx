"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./TiltCard.module.scss";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // daraja
  glare?: boolean;
  ariaHidden?: boolean;
}

// Karta sichqoncha holatiga qarab 3D burchakda egiladi (perspective tilt) +
// ixtiyoriy "glare" — oyna nurlanishi effekti. Feature/pricing kartalarga mos.
export function TiltCard({
  children,
  className,
  maxTilt = 10,
  glare = true,
  ariaHidden,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const springPx = useSpring(px, { stiffness: 150, damping: 20 });
  const springPy = useSpring(py, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springPy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springPx, [0, 1], [-maxTilt, maxTilt]);
  const glareX = useTransform(springPx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(springPy, [0, 1], ["0%", "100%"]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      className={`${styles.tilt} ${className ?? ""}`}
      aria-hidden={ariaHidden}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
    >
      {children}
      {glare && (
        <motion.div
          className={styles.glare}
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.25), transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  );
}
