"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with logo and back button */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <span className="text-lg font-bold text-primary-foreground">T</span>
          </div>
          <span className="text-xl font-bold">Truststaking</span>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Site
          </Button>
        </Link>
      </div>

      {/* Auth content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}


