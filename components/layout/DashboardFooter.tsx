"use client";

export function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 md:px-6">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {currentYear} Truststaking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

