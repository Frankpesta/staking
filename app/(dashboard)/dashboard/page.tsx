"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePortfolioValue } from "@/lib/hooks/usePortfolioValue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, ArrowUp } from "lucide-react";
import { staggerFadeIn } from "@/lib/utils/animations";
import { StaggerChildren } from "@/components/animations/StaggerChildren";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const balance = useQuery(
    api.balances.getUserBalance,
    user?._id ? { userId: user._id } : "skip"
  );
  const activities = useQuery(
    api.activities.getUserActivities,
    user?._id ? { userId: user._id, limit: 5 } : "skip"
  );

  // Calculate total portfolio value in USD using real-time prices
  // Must be called before any early returns (React Hook rules)
  const portfolioValue = usePortfolioValue(balance || undefined);

  useEffect(() => {
    if (balance) {
      staggerFadeIn(".balance-card", 0.1);
    }
  }, [balance]);

  // Show loading state only while initially fetching user
  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If no user after loading completes, show error message
  // (Layout should redirect, but this is a fallback)
  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              Unable to load user data. Your session may have expired.
            </p>
            <a href="/login">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Go to Login
              </button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Welcome back, {user.email}
        </p>
      </div>

      {/* Balance Cards */}
      {balance === undefined ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <StaggerChildren className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="balance-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold break-words">
                {portfolioValue.isLoading ? (
                  <span className="inline-block h-6 w-24 animate-pulse rounded bg-muted" />
                ) : (
                  `$${portfolioValue.totalAvailable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to stake or withdraw
                {portfolioValue.lastUpdated && (
                  <span className="block mt-1">Updated {new Date(portfolioValue.lastUpdated).toLocaleTimeString()}</span>
                )}
                {portfolioValue.error && (
                  <span className="block mt-1 text-yellow-600 dark:text-yellow-400">{portfolioValue.error}</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staked Balance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold break-words">
                {portfolioValue.isLoading ? (
                  <span className="inline-block h-6 w-24 animate-pulse rounded bg-muted" />
                ) : (
                  `$${portfolioValue.totalStaked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently staking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
              <ArrowUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold break-words">
                {portfolioValue.isLoading ? (
                  <span className="inline-block h-6 w-24 animate-pulse rounded bg-muted" />
                ) : (
                  `$${portfolioValue.totalDeposited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                All-time deposits
              </p>
            </CardContent>
          </Card>
        </StaggerChildren>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest transactions and activities</CardDescription>
        </CardHeader>
        <CardContent>
          {activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base break-words">{activity.description}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </CardContent>
      </Card>

      {/* KYC Status */}
      {user.kycStatus !== "approved" && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle>Complete KYC Verification</CardTitle>
            <CardDescription>
              Verify your identity to unlock all features and increase your limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/dashboard/kyc">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Start Verification
              </button>
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


