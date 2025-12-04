"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ArrowUpDown,
  FileText,
  HelpCircle,
  Activity,
  Settings,
  LogOut,
  Menu,
  ArrowDownCircle,
  ArrowUpCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Deposit", href: "/dashboard/deposit", icon: ArrowDownCircle },
  { name: "Withdraw", href: "/dashboard/withdraw", icon: ArrowUpCircle },
  { name: "Staking", href: "/dashboard/staking", icon: TrendingUp },
  { name: "Swap", href: "/dashboard/swap", icon: ArrowUpDown },
  { name: "Transactions", href: "/dashboard/transactions", icon: FileText },
  { name: "KYC", href: "/dashboard/kyc", icon: FileText },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Sidebar content component (reusable for desktop and mobile)
function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLinkClick = () => {
    onLinkClick?.();
  };

  return (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Truststaking</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer relative z-10",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="mb-4 px-3 text-sm">
          <div className="font-medium">{user?.email}</div>
          <div className="text-xs text-muted-foreground">
            {user?.kycStatus === "approved" ? "✓ Verified" : "Unverified"}
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            logout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );
}

export function DashboardSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex h-full flex-col">
            <SidebarContent onLinkClick={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:border-r md:bg-card md:z-40">
        <div className="flex h-screen flex-col">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}

