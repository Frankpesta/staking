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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
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
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold capitalize ${getTypeColor(transaction.type)}`}>
                          {transaction.type}
                        </span>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {transaction.amount.toFixed(6)} {transaction.coin}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.requestedAt).toLocaleString()}
                      </p>
                      {transaction.adminNote && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Note: {transaction.adminNote}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {explorerUrl && (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
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

