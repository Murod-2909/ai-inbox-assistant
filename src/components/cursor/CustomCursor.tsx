"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.scss";

// Global kursor: yumshoq halqa sichqoncha ortidan "lag" bilan ergashadi,
// interaktiv elementlar (link/button/card) ustida kattalashadi.
// Faqat "fine pointer" (sichqonchali) qurilmalarda ishlaydi — mobil/touch'da o'chadi.
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFine);
    if (!isFine) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    function handleMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    }

    // Halqa sichqonchani "lag" bilan quvadi — yumshoq, organik his
    let raf = 0;
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      raf = requestAnimationFrame(animateRing);
    }
    raf = requestAnimationFrame(animateRing);

    function handleOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, [data-cursor='hover']",
      );
      setHovering(!!interactive);
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div
        ref={ringRef}
        className={`${styles.ring} ${hovering ? styles.ringHover : ""}`}
      />
    </>
  );
}
