"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  TrendingUp,
  Shield,
  Settings,
  HelpCircle,
  BarChart3,
  LogOut,
  Menu,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Transactions", href: "/admin/transactions", icon: FileText },
  { name: "Staking Pools", href: "/admin/staking", icon: TrendingUp },
  { name: "KYC Reviews", href: "/admin/kyc", icon: Shield },
  { name: "Support Tickets", href: "/admin/support", icon: HelpCircle },
  { name: "Send Emails", href: "/admin/emails", icon: Mail },
  { name: "Platform Wallets", href: "/admin/wallets", icon: Wallet },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

// Sidebar content component (reusable for desktop and mobile)
function AdminSidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLinkClick = () => {
    onLinkClick?.();
  };

  return (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
          <div className="text-xs text-muted-foreground">Super Admin</div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/dashboard" className="flex-1" onClick={handleLinkClick}>
            <Button variant="outline" className="w-full justify-start text-xs">
              User View
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="flex-1 justify-start"
            onClick={() => {
              handleLinkClick();
              logout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}

export function AdminSidebar() {
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
            <AdminSidebarContent onLinkClick={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:border-r md:bg-card">
        <div className="flex h-screen flex-col">
          <AdminSidebarContent />
        </div>
      </aside>
    </>
  );
}

