"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Globe,
  Lock,
  CheckCircle,
  Sparkles,
  Coins,
  BarChart3,
  Users,
  Award,
  ArrowDown,
  Wallet,
  Network,
  Clock,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { fadeIn, staggerFadeIn } from "@/lib/utils/animations";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerChildren } from "@/components/animations/StaggerChildren";
import { BlockchainGrid } from "@/components/shared/BlockchainGrid";
import { CryptoIcon } from "@/components/shared/CryptoIcon";

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            href="#features"
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#staking"
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Staking
          </Link>
          <Link
            href="#security"
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Security
          </Link>
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Link href="/login">
              <Button variant="ghost" className="w-full justify-start">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function Home() {
  useEffect(() => {
    fadeIn(".hero-content", 0.2);
    staggerFadeIn(".stat-item", 0.1);
    staggerFadeIn(".feature-card", 0.15);
    staggerFadeIn(".staking-option", 0.1);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
              <Coins className="h-4 w-4 md:h-6 md:w-6 text-primary-foreground" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Truststaking
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#staking" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Staking
            </Link>
            <Link href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Security
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="text-xs md:text-sm bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                Get Started
              </Button>
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-16 md:pt-20">
        <section className="relative overflow-hidden border-b py-32 sm:py-40">
          {/* Animated background with crypto-themed gradients */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
            
            {/* Floating crypto icons */}
            <div className="absolute top-20 left-10 opacity-20 animate-pulse">
              <CryptoIcon symbol="ETH" size={60} />
            </div>
            <div className="absolute top-40 right-20 opacity-15 animate-pulse delay-300">
              <CryptoIcon symbol="BTC" size={80} />
            </div>
            <div className="absolute bottom-32 left-1/4 opacity-20 animate-pulse delay-700">
              <CryptoIcon symbol="MATIC" size={50} />
            </div>
            <div className="absolute bottom-20 right-1/3 opacity-15 animate-pulse delay-1000">
              <CryptoIcon symbol="BNB" size={70} />
            </div>
          </div>

          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl text-center hero-content">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Multi-Chain Staking Platform
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Earn Passive Income
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Through Crypto Staking
                </span>
          </h1>

              {/* Subheading */}
              <p className="mb-10 mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Secure, transparent, and profitable staking across multiple blockchains.
                <br />
                Start earning fixed returns on your crypto assets today.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="group h-14 px-8 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
                    Start Staking Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold border-2">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>No Lock-in Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Instant Withdrawals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>24/7 Support</span>
                </div>
              </div>

              {/* Scroll indicator */}
              <div className="mt-16 flex justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <span className="text-xs">Scroll to explore</span>
                  <ArrowDown className="h-5 w-5 animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b bg-muted/30 py-16">
          <div className="container mx-auto px-6">
            <StaggerChildren className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center stat-item">
                <div className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  $50M+
                </div>
                <div className="text-sm font-medium text-muted-foreground">Total Value Locked</div>
              </div>
              <div className="text-center stat-item">
                <div className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm font-medium text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center stat-item">
                <div className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  7
                </div>
                <div className="text-sm font-medium text-muted-foreground">Blockchains</div>
              </div>
              <div className="text-center stat-item">
                <div className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-sm font-medium text-muted-foreground">Uptime</div>
              </div>
            </StaggerChildren>
          </div>
        </section>

        {/* Supported Blockchains */}
        <section className="border-b py-24 sm:py-32">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                Multi-Chain Support
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Stake your assets across 7 major blockchains. One platform, unlimited possibilities.
              </p>
            </div>
            <BlockchainGrid />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-b py-24 sm:py-32">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                Why Choose Truststaking?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                A comprehensive staking platform designed for both beginners and experienced crypto investors
              </p>
            </div>
            <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Multi-Chain Support</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Stake on Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche, and Base. One platform for all your staking needs.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Fixed Returns</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Predictable ROI with flexible staking periods from 30 to 365 days. Know exactly what you&apos;ll earn.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Secure & Transparent</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Enterprise-grade security with transparent transaction tracking. Your funds are always safe.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <Lock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">KYC Verified</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Compliant platform with identity verification for enhanced security and regulatory compliance.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Fast Processing</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Quick deposits and withdrawals with admin-verified transactions. Get your funds when you need them.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">24/7 Support</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Dedicated support team ready to assist you anytime. We&apos;re here when you need us.
                </p>
              </div>
            </StaggerChildren>
          </div>
        </section>

        {/* Staking Options */}
        <section id="staking" className="border-b bg-gradient-to-b from-muted/40 via-background to-background py-24 sm:py-32">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                Flexible Staking Options
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Choose the staking duration that works best for you. Longer periods offer higher returns.
              </p>
            </div>
            <StaggerChildren className="grid gap-6 md:grid-cols-5">
              {[
                { duration: 30, roi: 5 },
                { duration: 60, roi: 12 },
                { duration: 90, roi: 20 },
                { duration: 180, roi: 45 },
                { duration: 365, roi: 100 },
              ].map((option) => (
                <div
                  key={option.duration}
                  className="group relative rounded-2xl border border-border/50 bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 staking-option"
                >
                  <div className="mb-2 text-3xl font-bold">{option.duration}</div>
                  <div className="mb-6 text-sm font-medium text-muted-foreground">Days</div>
                  <div className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {option.roi}%
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">ROI</div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="border-b py-24 sm:py-32">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                  Security First
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Your security is our top priority. We implement industry-leading security measures.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <Shield className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold">Encrypted Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    All sensitive data is encrypted at rest and in transit
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <Lock className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold">2FA Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Optional two-factor authentication for enhanced security
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <BarChart3 className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold">Audit Ready</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete transaction history and audit trails
          </p>
        </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <ScrollReveal>
          <section className="py-24 sm:py-32">
            <div className="container mx-auto px-6">
              <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12 text-center sm:p-16">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)]" />
                <div className="relative">
                  <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                    Ready to Start Earning?
                  </h2>
                  <p className="mb-10 mx-auto max-w-2xl text-lg text-muted-foreground">
                    Join thousands of users earning passive income through crypto staking.
                    Start your journey today.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link href="/signup">
                      <Button size="lg" className="group h-14 px-8 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold border-2">
                        Sign In to Account
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
        </div>
          </section>
        </ScrollReveal>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
                  <Coins className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Truststaking</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Secure multi-chain crypto staking platform. Earn passive income with confidence.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/dashboard/staking" className="text-muted-foreground hover:text-foreground transition-colors">
                    Staking
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/deposit" className="text-muted-foreground hover:text-foreground transition-colors">
                    Deposits
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/swap" className="text-muted-foreground hover:text-foreground transition-colors">
                    Swap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/dashboard/support" className="text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/kyc" className="text-muted-foreground hover:text-foreground transition-colors">
                    KYC
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border/50 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">
                &copy; 2024 Truststaking. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Discord</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Telegram</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
