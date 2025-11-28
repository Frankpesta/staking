"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, CheckCircle, XCircle, Clock, Info, Copy } from "lucide-react";
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
  const rejectMutation = useMutation(api.transactions.rejectTransactionPublic);
  const completeMutation = useMutation(api.transactions.completeTransactionPublic);

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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Transaction Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Review and process pending transactions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
              className="text-xs sm:text-sm"
            >
              All
            </Button>
            <Button
              variant={filter === "deposit" ? "default" : "outline"}
              onClick={() => setFilter("deposit")}
              size="sm"
              className="text-xs sm:text-sm"
            >
              Deposits
            </Button>
            <Button
              variant={filter === "withdrawal" ? "default" : "outline"}
              onClick={() => setFilter("withdrawal")}
              size="sm"
              className="text-xs sm:text-sm"
            >
              Withdrawals
            </Button>
            <Button
              variant={filter === "swap" ? "default" : "outline"}
              onClick={() => setFilter("swap")}
              size="sm"
              className="text-xs sm:text-sm"
            >
              Swaps
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Withdrawal Instructions */}
      {pendingTransactions && pendingTransactions.some(t => t.type === "withdrawal" && t.status === "pending") && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Info className="h-5 w-5" />
              Manual Withdrawal Process
            </CardTitle>
            <CardDescription className="text-blue-800 dark:text-blue-200">
              Withdrawals are processed manually. Follow these steps:
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Review the withdrawal request and verify the user&apos;s balance</li>
              <li>Click &quot;Approve&quot; to approve the withdrawal</li>
              <li>Send the funds manually from your platform wallet to the user&apos;s address</li>
              <li>After the transaction is confirmed on-chain, click &quot;Complete&quot; and enter the transaction hash</li>
            </ol>
            <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Always verify the recipient address and amount before sending funds.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pending Transactions ({pendingTransactions?.length || 0})
          </CardTitle>
          <CardDescription>
            Review and approve or reject transactions. Withdrawals require manual processing.
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
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">
                              To: {transaction.walletAddress.slice(0, 10)}...{transaction.walletAddress.slice(-8)}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => {
                                navigator.clipboard.writeText(transaction.walletAddress!);
                                alert("Address copied!");
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {transaction.type === "withdrawal" && transaction.fromAddress && (
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">
                              From: {transaction.fromAddress.slice(0, 10)}...{transaction.fromAddress.slice(-8)}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => {
                                navigator.clipboard.writeText(transaction.fromAddress!);
                                alert("Address copied!");
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
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
                    <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(transaction._id)}
                        className="flex-1 text-xs sm:text-sm"
                      >
                        <CheckCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const reason = prompt("Rejection reason:");
                          if (reason) handleReject(transaction._id, reason);
                        }}
                        className="flex-1 text-xs sm:text-sm"
                      >
                        <XCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Reject
                      </Button>
                      {transaction.type === "withdrawal" && transaction.status === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const txHash = prompt("Enter the transaction hash from the blockchain:\n\nAfter sending funds manually, paste the transaction hash here:");
                            if (txHash && txHash.trim()) {
                              handleComplete(transaction._id, txHash.trim());
                            }
                          }}
                          className="text-xs sm:text-sm"
                        >
                          Complete (Enter TX Hash)
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

