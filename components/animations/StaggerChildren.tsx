"use client";

import { useEffect, useRef } from "react";
import { staggerFadeIn } from "@/lib/utils/animations";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerChildren({
  children,
  className = "",
  delay = 0.1,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const children = ref.current.children;
      staggerFadeIn(Array.from(children) as HTMLElement[], delay);
    }
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

