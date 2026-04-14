"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { TradingViewTicker } from "@/components/shared/TradingViewTicker";
import { useAuth } from "@/lib/hooks/useAuth";
import { getAuthToken } from "@/lib/utils/cookies";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;

    const t = window.setTimeout(() => {
      const stored = getAuthToken();
      if (!stored) {
        router.replace("/login");
        return;
      }
      if (user === null) {
        router.replace("/login");
      }
    }, 300);

    return () => clearTimeout(t);
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col md:ml-64">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>

        {/* TradingView Ticker */}
        <div className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 md:px-6 py-2">
            <TradingViewTicker />
          </div>
        </div>

        <DashboardFooter />
      </div>
    </div>
  );
}
