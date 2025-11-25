"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { swapSchema, type SwapInput } from "@/lib/validations/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CoinSelector } from "@/components/shared/CoinSelector";
import { ArrowLeftRight } from "lucide-react";
import { DEFAULT_COINS } from "@/lib/constants";

export default function SwapPage() {
  const { user } = useAuth();
  const [fromCoin, setFromCoin] = useState<string>("");
  const [toCoin, setToCoin] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const balance = useQuery(
    api.balances.getUserBalance,
    user?._id ? { userId: user._id } : "skip"
  );

  const getExchangeRateQuery = useQuery(
    api.swaps.getExchangeRate,
    fromCoin && toCoin && fromCoin !== toCoin
      ? { fromCoin, toCoin }
      : "skip"
  );

  const createSwapMutation = useMutation(api.swaps.createSwap);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SwapInput>({
    resolver: zodResolver(swapSchema),
  });

  const amount = watch("amount");
  const availableBalance = balance?.availableBalance as Record<string, number> | undefined;
  const fromBalance = fromCoin ? (availableBalance?.[fromCoin] || 0) : 0;

  useEffect(() => {
    if (getExchangeRateQuery?.rate) {
      setExchangeRate(getExchangeRateQuery.rate);
    }
  }, [getExchangeRateQuery]);

  const calculateToAmount = () => {
    if (!amount || !exchangeRate) return 0;
    return amount * exchangeRate;
  };

  const swapCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
    setValue("fromCoin", toCoin);
    setValue("toCoin", temp);
  };

  const onSubmit = async (data: SwapInput) => {
    if (!user?._id) return;

    if (fromBalance < data.amount) {
      setError("Insufficient balance");
      return;
    }

    if (data.fromCoin === data.toCoin) {
      setError("Cannot swap the same coin");
      return;
    }

    try {
      setError(null);
      await createSwapMutation({
        userId: user._id,
        fromCoin: data.fromCoin,
        toCoin: data.toCoin,
        amount: data.amount,
        exchangeRate,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setValue("amount", 0);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create swap request");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Swap Coins</h1>
        <p className="text-muted-foreground">
          Exchange one cryptocurrency for another
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Swap Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Swap Request</CardTitle>
            <CardDescription>
              Select coins and enter amount
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
                  Swap request submitted! Admin will process it shortly.
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">From Coin</label>
                <CoinSelector
                  value={fromCoin}
                  onValueChange={(value) => {
                    setFromCoin(value);
                    setValue("fromCoin", value);
                  }}
                />
                {errors.fromCoin && (
                  <p className="text-sm text-destructive">{errors.fromCoin.message}</p>
                )}
                {fromCoin && (
                  <p className="text-xs text-muted-foreground">
                    Available: {fromBalance.toFixed(6)} {fromCoin}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={swapCoins}
                  disabled={!fromCoin || !toCoin}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">To Coin</label>
                <CoinSelector
                  value={toCoin}
                  onValueChange={(value) => {
                    setToCoin(value);
                    setValue("toCoin", value);
                  }}
                />
                {errors.toCoin && (
                  <p className="text-sm text-destructive">{errors.toCoin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount ({fromCoin || "From Coin"})
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  placeholder="0.00"
                  max={fromBalance}
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue("amount", fromBalance)}
                  className="text-xs"
                >
                  Use Max
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !fromCoin || !toCoin || fromCoin === toCoin}
              >
                {isSubmitting ? "Submitting..." : "Submit Swap Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Swap Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Swap Preview</CardTitle>
            <CardDescription>
              Review your swap details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {amount && fromCoin && toCoin && fromCoin !== toCoin ? (
              <>
                <div className="space-y-2 rounded-md border p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">You Send</span>
                    <span className="font-medium">{amount.toFixed(6)} {fromCoin}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span className="font-medium">1 {fromCoin} = {exchangeRate.toFixed(6)} {toCoin}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">You Receive</span>
                      <span className="font-bold text-lg text-green-600">
                        {calculateToAmount().toFixed(6)} {toCoin}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">
                  <p className="font-medium">Note:</p>
                  <p className="mt-1">
                    Swap requests require admin approval. The exchange rate may vary slightly at the time of processing.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
                <p className="text-sm text-muted-foreground">
                  Select coins and enter amount to see swap preview
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

