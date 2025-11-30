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
  Star,
  Activity,
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
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { TradingViewTicker } from "@/components/shared/TradingViewTicker";

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
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-lg shadow-primary/25">
              <Coins className="h-4 w-4 md:h-6 md:w-6 text-primary-foreground" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Truststaking
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link href="#staking" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Staking
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Security
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="text-xs md:text-sm bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/95 hover:via-primary/90 hover:to-primary/75 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
                Get Started
              </Button>
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-16 md:pt-20">
        <section className="relative overflow-hidden border-b py-20 sm:py-32 md:py-40 min-h-[90vh] flex items-center">
          {/* Enhanced Animated Background */}
          <AnimatedBackground />

          {/* Floating Crypto Icons with Enhanced Animation */}
          <div className="absolute top-20 left-10 opacity-20 animate-float">
            <CryptoIcon symbol="ETH" size={80} />
          </div>
          <div className="absolute top-40 right-20 opacity-15 animate-float" style={{ animationDelay: '1s' }}>
            <CryptoIcon symbol="BTC" size={100} />
          </div>
          <div className="absolute bottom-32 left-1/4 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
            <CryptoIcon symbol="MATIC" size={70} />
          </div>
          <div className="absolute bottom-20 right-1/3 opacity-15 animate-float" style={{ animationDelay: '1.5s' }}>
            <CryptoIcon symbol="BNB" size={90} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 animate-pulse-slow">
            <div className="w-96 h-96 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center hero-content">
              {/* Left Column - Content */}
              <div className="text-center lg:text-left">
                {/* Enhanced Badge */}
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md px-6 py-2.5 text-sm font-medium shadow-lg shadow-primary/10 relative overflow-hidden">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse relative z-10" />
                  <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent relative z-10">
                    Multi-Chain Staking Platform
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-shimmer" />
                </div>

                {/* Enhanced Main Heading */}
                <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                  <span className="block mb-2">Earn Passive Income</span>
                  <span className="block bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent animate-gradient">
                    Through Crypto Staking
                  </span>
                </h1>

                {/* Enhanced Subheading */}
                <p className="mb-10 text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl">
                  Secure, transparent, and profitable staking across multiple blockchains.
                  <br className="hidden sm:block" />
                  <span className="text-foreground/80">Start earning fixed returns on your crypto assets today.</span>
                </p>

                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                  <Link href="/signup">
                    <Button size="lg" className="group h-16 px-10 text-base font-semibold bg-gradient-to-r from-primary via-primary/95 to-primary/80 hover:from-primary hover:via-primary/95 hover:to-primary/85 shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/40">
                      <span className="relative z-10">Start Staking Now</span>
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 relative z-10" />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="h-16 px-10 text-base font-semibold border-2 hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-105">
                      Sign In
                    </Button>
                  </Link>
                </div>

                {/* Enhanced Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">No Lock-in Period</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Instant Withdrawals</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Right Column - SVG Illustration */}
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-lg lg:max-w-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl animate-pulse-slow" />
                  <div className="relative z-10">
                    <img 
                      src="/rewards.svg" 
                      alt="Crypto Staking Rewards" 
                      className="w-full h-auto animate-float"
                      style={{ animationDuration: '6s' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Scroll indicator */}
            <div className="mt-16 flex justify-center">
              <div className="flex flex-col items-center gap-3 text-muted-foreground animate-bounce">
                <span className="text-xs font-medium">Scroll to explore</span>
                <ArrowDown className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="border-b bg-gradient-to-b from-muted/40 via-muted/20 to-background py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_70%)]" />
          <div className="container mx-auto px-6 relative z-10">
            <StaggerChildren className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center stat-item group">
                <div className="mb-3 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 backdrop-blur-sm">
                  <TrendingUp className="h-10 w-10 text-primary" />
                </div>
                <div className="mb-2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  $50M+
                </div>
                <div className="text-sm font-medium text-muted-foreground">Total Value Locked</div>
              </div>
              <div className="text-center stat-item group">
                <div className="mb-3 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div className="mb-2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm font-medium text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center stat-item group">
                <div className="mb-3 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Network className="h-10 w-10 text-primary" />
                </div>
                <div className="mb-2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  7
                </div>
                <div className="text-sm font-medium text-muted-foreground">Blockchains</div>
              </div>
              <div className="text-center stat-item group">
                <div className="mb-3 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Activity className="h-10 w-10 text-primary" />
                </div>
                <div className="mb-2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-sm font-medium text-muted-foreground">Uptime</div>
              </div>
            </StaggerChildren>
          </div>
        </section>

        {/* Enhanced Supported Blockchains */}
        <section className="border-b py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Multi-Chain Support
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                  Stake your assets across 7 major blockchains. One platform, unlimited possibilities.
                </p>
              </div>
              <BlockchainGrid />
            </ScrollReveal>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="features" className="border-b py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.05),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Why Choose Truststaking?
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                  A comprehensive staking platform designed for both beginners and experienced crypto investors
                </p>
              </div>
            </ScrollReveal>
            
            {/* Visual Showcase with COSMOS Image */}
            <div className="mb-16 grid lg:grid-cols-2 gap-8 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl animate-pulse-slow" />
                <div className="relative z-10 rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm p-4">
                  <img 
                    src="/COSMOS_LNX.webp" 
                    alt="Cosmos Network Staking" 
                    className="w-full h-auto rounded-xl object-cover animate-float"
                    style={{ animationDuration: '8s' }}
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 border border-primary/20">
                  <Network className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-4 text-3xl font-bold">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Advanced Blockchain Technology
                  </span>
                </h3>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  Built on cutting-edge blockchain infrastructure, our platform leverages the power of multiple networks including Cosmos, ensuring fast, secure, and scalable staking operations across the entire ecosystem.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                    Multi-Chain
                  </div>
                  <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                    Scalable
                  </div>
                  <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                    Secure
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Showcase with App Image */}
            <ScrollReveal>
              <div className="mb-16 grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl animate-pulse-slow" />
                  <div className="relative z-10 rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm p-4">
                    <img 
                      src="/app.png" 
                      alt="Mobile App Interface" 
                      className="w-full h-auto rounded-xl object-cover animate-float"
                      style={{ animationDuration: '7s' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 border border-primary/20">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold">
                    <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                      Mobile-First Experience
                    </span>
                  </h3>
                  <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                    Manage your staking portfolio on the go with our intuitive mobile application. Monitor your earnings, track performance, and execute transactions seamlessly from anywhere in the world.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                      Mobile App
                    </div>
                    <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                      Real-Time
                    </div>
                    <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                      User-Friendly
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Visual Showcase with Candles Image */}
            <ScrollReveal>
              <div className="mb-16 grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative order-2 lg:order-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl animate-pulse-slow" />
                  <div className="relative z-10 rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm p-4">
                    <img 
                      src="/candles.png" 
                      alt="Trading Analytics" 
                      className="w-full h-auto rounded-xl object-cover animate-float"
                      style={{ animationDuration: '9s' }}
                    />
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 border border-primary/20">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold">
                    <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                      Advanced Analytics & Insights
                    </span>
                  </h3>
                  <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                    Get comprehensive market insights and detailed analytics to make informed staking decisions. Track performance metrics, analyze trends, and optimize your portfolio with real-time data visualization.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                      Analytics
                    </div>
                    <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                      Insights
                    </div>
                    <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                      Data-Driven
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Visual Showcase with Experienced Trade Image */}
            <ScrollReveal>
              <div className="mb-16 grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl animate-pulse-slow" />
                  <div className="relative z-10 rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm p-4">
                    <img 
                      src="/experienced-trade.png" 
                      alt="Experienced Trading Platform" 
                      className="w-full h-auto rounded-xl object-cover animate-float"
                      style={{ animationDuration: '8s' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 border border-primary/20">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold">
                    <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                      Professional Trading Tools
                    </span>
                  </h3>
                  <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                    Designed for experienced traders and investors, our platform offers advanced trading tools, comprehensive market analysis, and professional-grade features to maximize your staking returns.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                      Professional
                    </div>
                    <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                      Advanced
                    </div>
                    <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                      Expert Tools
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 feature-card">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 border border-primary/20 relative z-10 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold relative z-10">Multi-Chain Support</h3>
                <p className="leading-relaxed text-muted-foreground relative z-10">
                  Stake on Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche, and Base. One platform for all your staking needs.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 feature-card">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 border border-primary/20 relative z-10 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold relative z-10">Fixed Returns</h3>
                <p className="leading-relaxed text-muted-foreground relative z-10">
                  Predictable ROI with flexible staking periods from 30 to 365 days. Know exactly what you&apos;ll earn.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 feature-card">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 border border-primary/20 relative z-10 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold relative z-10">Secure & Transparent</h3>
                <p className="leading-relaxed text-muted-foreground relative z-10">
                  Enterprise-grade security with transparent transaction tracking. Your funds are always safe.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 feature-card">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 border border-primary/20 relative z-10 group-hover:scale-110 transition-transform">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold relative z-10">KYC Verified</h3>
                <p className="leading-relaxed text-muted-foreground relative z-10">
                  Compliant platform with identity verification for enhanced security and regulatory compliance.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 feature-card">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 border border-primary/20 relative z-10 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold relative z-10">Fast Processing</h3>
                <p className="leading-relaxed text-muted-foreground relative z-10">
                  Quick deposits and withdrawals with admin-verified transactions. Get your funds when you need them.
                </p>
              </div>
              <div className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 feature-card">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 border border-primary/20 relative z-10 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold relative z-10">24/7 Support</h3>
                <p className="leading-relaxed text-muted-foreground relative z-10">
                  Dedicated support team ready to assist you anytime. We&apos;re here when you need us.
                </p>
              </div>
            </StaggerChildren>
          </div>
        </section>

        {/* Enhanced Staking Options */}
        <section id="staking" className="border-b bg-gradient-to-b from-muted/40 via-background to-background py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.08),transparent_70%)]" />
          <div className="container mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Flexible Staking Options
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                  Choose the staking duration that works best for you. Longer periods offer higher returns.
                </p>
              </div>
            </ScrollReveal>
            <StaggerChildren className="grid gap-6 md:grid-cols-5">
              {[
                { duration: 30, roi: 5 },
                { duration: 60, roi: 12 },
                { duration: 90, roi: 20 },
                { duration: 180, roi: 45 },
                { duration: 365, roi: 100 },
              ].map((option, index) => (
                <div
                  key={option.duration}
                  className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 text-center transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 staking-option"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mb-2 text-4xl font-bold">{option.duration}</div>
                    <div className="mb-6 text-sm font-medium text-muted-foreground">Days</div>
                    <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                      {option.roi}%
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">ROI</div>
                  </div>
                  {index === 2 && (
                    <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-primary/20 border border-primary/30 px-2 py-1 text-xs font-semibold text-primary">
                      <Star className="h-3 w-3 fill-primary" />
                      Popular
                    </div>
                  )}
                </div>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* Enhanced Security Section */}
        <section id="security" className="border-b py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="mx-auto max-w-4xl">
                <div className="mb-12 text-center">
                  <h2 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
                    <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                      Security First
                    </span>
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                    Your security is our top priority. We implement industry-leading security measures.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold text-lg">Encrypted Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      All sensitive data is encrypted at rest and in transit
                    </p>
                  </div>
                  <div className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold text-lg">2FA Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Optional two-factor authentication for enhanced security
                    </p>
                  </div>
                  <div className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold text-lg">Audit Ready</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete transaction history and audit trails
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <ScrollReveal>
          <section className="py-24 sm:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
            <div className="container mx-auto px-6 relative z-10">
              <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12 text-center sm:p-16 md:p-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.15),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent_50%)]" />
                <div className="relative z-10">
                  <h2 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
                    <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                      Ready to Start Earning?
                    </span>
                  </h2>
                  <p className="mb-10 mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                    Join thousands of users earning passive income through crypto staking.
                    Start your journey today.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link href="/signup">
                      <Button size="lg" className="group h-16 px-10 text-base font-semibold bg-gradient-to-r from-primary via-primary/95 to-primary/80 hover:from-primary hover:via-primary/95 hover:to-primary/85 shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/40">
                        <span className="relative z-10">Get Started Free</span>
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 relative z-10" />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button size="lg" variant="outline" className="h-16 px-10 text-base font-semibold border-2 hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-105">
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

      {/* TradingView Ticker Tape - Above Footer */}
      <div className="w-full border-t border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 py-2">
          <TradingViewTicker />
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="border-t bg-muted/30 backdrop-blur-sm py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.05),transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-lg shadow-primary/25">
                  <Coins className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Truststaking</span>
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
