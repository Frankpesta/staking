"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withdrawalSchema, type WithdrawalInput } from "@/lib/validations/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CoinSelector } from "@/components/shared/CoinSelector";
import { DEFAULT_COINS } from "@/lib/constants";
import { isAddress } from "viem";

export default function WithdrawPage() {
  const { user } = useAuth();
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const balance = useQuery(
    api.balances.getUserBalance,
    user?._id ? { userId: user._id } : "skip"
  );

  const createWithdrawalMutation = useMutation(api.transactions.createWithdrawal);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<WithdrawalInput>({
    resolver: zodResolver(withdrawalSchema),
  });

  const coin = watch("coin");
  const amount = watch("amount");
  const walletAddress = watch("walletAddress");

  const selectedCoinConfig = DEFAULT_COINS.find((c) => c.symbol === selectedCoin);
  const availableBalance = balance?.availableBalance as Record<string, number> | undefined;
  const currentBalance = selectedCoin ? (availableBalance?.[selectedCoin] || 0) : 0;

  const onSubmit = async (data: WithdrawalInput) => {
    if (!user?._id) return;

    // Validate address format
    if (!isAddress(data.walletAddress)) {
      setError("Invalid wallet address format");
      return;
    }

    // Check balance
    if (currentBalance < data.amount) {
      setError("Insufficient balance");
      return;
    }

    // Check minimum withdrawal
    if (selectedCoinConfig && data.amount < selectedCoinConfig.minWithdrawal) {
      setError(`Minimum withdrawal: ${selectedCoinConfig.minWithdrawal} ${selectedCoin}`);
      return;
    }

    try {
      setError(null);
      await createWithdrawalMutation({
        userId: user._id,
        coin: data.coin,
        amount: data.amount,
        walletAddress: data.walletAddress,
        chainId: selectedCoinConfig?.chainId,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setValue("amount", 0);
        setValue("walletAddress", "");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create withdrawal request");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Withdraw Funds</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Request withdrawal to your external wallet
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Withdrawal Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Withdrawal Request</CardTitle>
            <CardDescription>
              Enter withdrawal details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-3 text-sm text-green-900 dark:bg-green-950 dark:text-green-100">
                  Withdrawal request submitted! Admin will process it shortly.
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Coin</label>
                <CoinSelector
                  value={selectedCoin}
                  onValueChange={(value) => {
                    setSelectedCoin(value);
                    setValue("coin", value);
                  }}
                />
                {errors.coin && (
                  <p className="text-sm text-destructive">{errors.coin.message}</p>
                )}
                {selectedCoin && (
                  <p className="text-xs text-muted-foreground">
                    Available: {currentBalance.toFixed(6)} {selectedCoin}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  placeholder="0.00"
                  max={currentBalance}
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
                {selectedCoinConfig && (
                  <p className="text-xs text-muted-foreground">
                    Minimum: {selectedCoinConfig.minWithdrawal} {selectedCoinConfig.symbol}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue("amount", currentBalance)}
                  className="text-xs"
                >
                  Use Max
                </Button>
              </div>

              <div className="space-y-2">
                <label htmlFor="walletAddress" className="text-sm font-medium">
                  Destination Wallet Address
                </label>
                <Input
                  id="walletAddress"
                  placeholder="0x..."
                  {...register("walletAddress")}
                />
                {errors.walletAddress && (
                  <p className="text-sm text-destructive">{errors.walletAddress.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Make sure this address is correct. Withdrawals cannot be reversed.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || !selectedCoin}>
                {isSubmitting ? "Submitting..." : "Submit Withdrawal Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">
              <p className="font-medium mb-2">Processing Time</p>
              <p>Withdrawals are typically processed within 24 hours after admin approval.</p>
            </div>

            <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100">
              <p className="font-medium mb-2">Important Notes</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Double-check the destination wallet address</li>
                <li>Ensure the address supports the selected coin</li>
                <li>Withdrawals are subject to admin approval</li>
                <li>Network fees may apply</li>
              </ul>
            </div>

            {selectedCoinConfig && (
              <div className="rounded-md bg-muted p-4 text-sm">
                <p className="font-medium mb-2">Coin Details</p>
                <div className="space-y-1">
                  <p>Symbol: {selectedCoinConfig.symbol}</p>
                  <p>Chain: {selectedCoinConfig.chainId}</p>
                  <p>Min Withdrawal: {selectedCoinConfig.minWithdrawal} {selectedCoinConfig.symbol}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

