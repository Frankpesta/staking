"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminOverviewPage() {
  const users = useQuery(api.users.listUsers, {});
  const pendingTransactions = useQuery(api.transactions.getPendingTransactions, {});
  const pendingKYC = useQuery(api.kyc.getPendingKYCDocuments);
  const tickets = useQuery(api.support.getAllTickets, { status: "open" });
  const activeStakingPools = useQuery(api.staking.getAllStakingPools, { status: "active" });

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const verifiedUsers = users?.filter((u) => u.emailVerified).length || 0;
  const kycApproved = users?.filter((u) => u.kycStatus === "approved").length || 0;
  const pendingDeposits = pendingTransactions?.filter((t) => t.type === "deposit").length || 0;
  const pendingWithdrawals = pendingTransactions?.filter((t) => t.type === "withdrawal").length || 0;

  // Mock chart data - in production, calculate from actual transactions
  const depositData = [
    { date: "Jan", amount: 45000 },
    { date: "Feb", amount: 52000 },
    { date: "Mar", amount: 48000 },
    { date: "Apr", amount: 61000 },
    { date: "May", amount: 55000 },
    { date: "Jun", amount: 67000 },
  ];

  const userGrowthData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 190 },
    { month: "Mar", users: 300 },
    { month: "Apr", users: 450 },
    { month: "May", users: 600 },
    { month: "Jun", users: 750 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Overview</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Platform statistics and management dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {verifiedUsers} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kycApproved}</div>
            <p className="text-xs text-muted-foreground">
              {pendingKYC?.length || 0} pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {pendingDeposits} deposits, {pendingWithdrawals} withdrawals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Deposit Volume</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Monthly deposit trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <LineChart data={depositData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <a href="/admin/transactions" className="rounded-lg border p-3 sm:p-4 hover:bg-accent transition-colors">
              <div className="font-semibold text-sm sm:text-base">Review Transactions</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {pendingTransactions?.length || 0} pending
              </div>
            </a>
            <a href="/admin/kyc" className="rounded-lg border p-3 sm:p-4 hover:bg-accent transition-colors">
              <div className="font-semibold text-sm sm:text-base">Review KYC</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {pendingKYC?.length || 0} pending
              </div>
            </a>
            <a href="/admin/support" className="rounded-lg border p-3 sm:p-4 hover:bg-accent transition-colors sm:col-span-2 lg:col-span-1">
              <div className="font-semibold text-sm sm:text-base">Support Tickets</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {tickets?.length || 0} open
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

