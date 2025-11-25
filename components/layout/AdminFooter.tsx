"use client";

import Link from "next/link";

export function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Truststaking Admin Panel. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/admin/settings" className="text-muted-foreground hover:text-foreground">
              Settings
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              User View
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

