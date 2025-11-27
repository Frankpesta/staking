"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/lib/constants";

export default function TransactionsPage() {
  const { user } = useAuth();
  const transactions = useQuery(
    api.transactions.getUserTransactions,
    user?._id ? { userId: user._id, limit: 50 } : "skip"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "rejected":
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600";
      case "withdrawal":
        return "text-red-600";
      case "stake":
        return "text-blue-600";
      case "swap":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getExplorerUrl = (chainId?: number, txHash?: string) => {
    if (!chainId || !txHash) return null;
    const chain = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId);
    if (!chain) return null;
    return `${chain.explorer}/tx/${txHash}`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          View all your transaction history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            All your deposits, withdrawals, stakes, and swaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const explorerUrl = getExplorerUrl(transaction.chainId, transaction.txHash);
                return (
                  <div
                    key={transaction._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border p-3 sm:p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-sm sm:text-base font-semibold capitalize ${getTypeColor(transaction.type)}`}>
                          {transaction.type}
                        </span>
                        <Badge className={`${getStatusColor(transaction.status)} text-xs`}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground break-words">
                        {transaction.amount.toFixed(6)} {transaction.coin}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(transaction.requestedAt).toLocaleString()}
                      </p>
                      {transaction.adminNote && (
                        <p className="mt-1 text-xs text-muted-foreground break-words">
                          Note: {transaction.adminNote}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      {explorerUrl && (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">View</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
              <p className="text-sm text-muted-foreground">No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

