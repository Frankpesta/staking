"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/hooks/useAuth";

export default function AdminTransactionsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal" | "swap">("all");
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  
  const pendingTransactions = useQuery(
    api.transactions.getPendingTransactions,
    filter === "all" ? {} : { type: filter }
  );

  const approveMutation = useMutation(api.transactions.approveTransaction);
  const rejectMutation = useMutation(api.transactions.rejectTransaction);
  const completeMutation = useMutation(api.transactions.completeTransaction);

  const handleApprove = async (transactionId: string) => {
    if (!user?._id) return;
    try {
      await approveMutation({
        transactionId: transactionId as any,
        adminId: user._id,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve");
    }
  };

  const handleReject = async (transactionId: string, reason: string) => {
    if (!user?._id) return;
    try {
      await rejectMutation({
        transactionId: transactionId as any,
        adminId: user._id,
        adminNote: reason,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject");
    }
  };

  const handleComplete = async (transactionId: string, txHash?: string) => {
    if (!user?._id) return;
    try {
      await completeMutation({
        transactionId: transactionId as any,
        adminId: user._id,
        txHash,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to complete");
    }
  };

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

  const getExplorerUrl = (chainId?: number, txHash?: string) => {
    if (!chainId || !txHash) return null;
    const chain = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId);
    if (!chain) return null;
    return `${chain.explorer}/tx/${txHash}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaction Management</h1>
          <p className="text-muted-foreground">
            Review and process pending transactions
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "deposit" ? "default" : "outline"}
              onClick={() => setFilter("deposit")}
            >
              Deposits
            </Button>
            <Button
              variant={filter === "withdrawal" ? "default" : "outline"}
              onClick={() => setFilter("withdrawal")}
            >
              Withdrawals
            </Button>
            <Button
              variant={filter === "swap" ? "default" : "outline"}
              onClick={() => setFilter("swap")}
            >
              Swaps
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pending Transactions ({pendingTransactions?.length || 0})
          </CardTitle>
          <CardDescription>
            Review and approve or reject transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTransactions && pendingTransactions.length > 0 ? (
            <div className="space-y-4">
              {pendingTransactions.map((transaction) => {
                const explorerUrl = getExplorerUrl(transaction.chainId, transaction.txHash);
                return (
                  <div
                    key={transaction._id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold capitalize">{transaction.type}</span>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Amount: {transaction.amount.toFixed(6)} {transaction.coin}
                        </p>
                        {transaction.walletAddress && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Address: {transaction.walletAddress.slice(0, 10)}...
                          </p>
                        )}
                        {transaction.txHash && (
                          <a
                            href={explorerUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            View on explorer <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Requested: {new Date(transaction.requestedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(transaction._id)}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const reason = prompt("Rejection reason:");
                          if (reason) handleReject(transaction._id, reason);
                        }}
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      {transaction.type === "withdrawal" && transaction.status === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const txHash = prompt("Transaction hash:");
                            if (txHash) handleComplete(transaction._id, txHash);
                          }}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
              <p className="text-sm text-muted-foreground">No pending transactions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

