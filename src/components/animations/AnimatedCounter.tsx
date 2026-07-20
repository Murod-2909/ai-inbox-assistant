"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2 }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      setDisplayValue(Math.floor(value * progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return (
    <div ref={ref}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {prefix}
        {displayValue}
        {suffix}
      </motion.span>
    </div>
  );
}
