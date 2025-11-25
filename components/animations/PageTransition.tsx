"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { fadeIn } from "@/lib/utils/animations";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const mainContent = document.querySelector("main");
    if (mainContent) {
      fadeIn(mainContent);
    }
  }, [pathname]);

  return <>{children}</>;
}

