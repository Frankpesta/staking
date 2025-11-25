"use client";

import { useEffect, useRef } from "react";
import { animateCounter } from "@/lib/utils/animations";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  decimals = 2,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (counterRef.current) {
      animateCounter(counterRef.current, value, duration);
    }
  }, [value, duration]);

  return (
    <span ref={counterRef} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

