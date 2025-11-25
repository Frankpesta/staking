"use client";

import { useEffect, useRef } from "react";
import { scrollFadeIn } from "@/lib/utils/animations";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      scrollFadeIn(ref.current);
    }
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

