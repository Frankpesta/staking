"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { swapSchema, type SwapInput } from "@/lib/validations/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CoinSelector } from "@/components/shared/CoinSelector";
import { ArrowLeftRight, Loader2 } from "lucide-react";

export default function SwapPage() {
  const { user } = useAuth();
  const [fromCoin, setFromCoin] = useState<string>("");
  const [toCoin, setToCoin] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [fromPriceUSD, setFromPriceUSD] = useState<number | null>(null);
  const [toPriceUSD, setToPriceUSD] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const balance = useQuery(
    api.balances.getUserBalance,
    user?._id ? { userId: user._id } : "skip"
  );

  const calculateExchangeRateAction = useAction((api.actions as any).cryptoPrices?.calculateExchangeRate);
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

  // Fetch real-time exchange rate when coins change
  const fetchExchangeRate = useCallback(async () => {
    if (!fromCoin || !toCoin || fromCoin === toCoin) {
      setExchangeRate(1);
      setFromPriceUSD(null);
      setToPriceUSD(null);
      return;
    }

    setIsLoadingRate(true);
    setError(null);

    try {
      const result = await calculateExchangeRateAction({
        fromCoin,
        toCoin,
      });

      setExchangeRate(result.rate);
      setFromPriceUSD(result.fromPriceUSD);
      setToPriceUSD(result.toPriceUSD);
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch exchange rate");
      setExchangeRate(1);
      setFromPriceUSD(null);
      setToPriceUSD(null);
    } finally {
      setIsLoadingRate(false);
    }
  }, [fromCoin, toCoin, calculateExchangeRateAction]);

  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  const calculateToAmount = () => {
    if (!amount || !exchangeRate) return 0;
    // This calculation ensures USD-based swaps work correctly
    // If swapping 10 USD to ETH, and ETH is $3000, you get 10/3000 = 0.00333 ETH
    return amount * exchangeRate;
  };

  const calculateUSDValue = (amount: number, coin: string, priceUSD: number | null) => {
    if (!priceUSD) return null;
    // USD is always 1:1
    if (coin.toUpperCase() === "USD") return amount;
    return amount * priceUSD;
  };

  const fromUSDValue = calculateUSDValue(amount || 0, fromCoin, fromPriceUSD);
  const toUSDValue = calculateUSDValue(calculateToAmount(), toCoin, toPriceUSD);

  const swapCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
    setValue("fromCoin", toCoin);
    setValue("toCoin", temp);
    // Reset amount when swapping coins
    setValue("amount", 0);
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
      setIsLoadingRate(true);
      
      // Recalculate exchange rate at submission time to ensure accuracy
      const latestRate = await calculateExchangeRateAction({
        fromCoin: data.fromCoin,
        toCoin: data.toCoin,
      });

      await createSwapMutation({
        userId: user._id,
        fromCoin: data.fromCoin,
        toCoin: data.toCoin,
        amount: data.amount,
        exchangeRate: latestRate.rate,
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setValue("amount", 0);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create swap request");
    } finally {
      setIsLoadingRate(false);
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
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Available: {fromBalance.toFixed(6)} {fromCoin}
                    </p>
                    {fromPriceUSD !== null && (
                      <p className="text-xs text-muted-foreground">
                        ≈ ${(fromBalance * fromPriceUSD).toFixed(2)} USD
                      </p>
                    )}
                  </div>
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
            {isLoadingRate && fromCoin && toCoin && fromCoin !== toCoin ? (
              <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading exchange rate...</span>
              </div>
            ) : amount && fromCoin && toCoin && fromCoin !== toCoin ? (
              <>
                <div className="space-y-3 rounded-md border p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">You Send</span>
                      <div className="text-right">
                        <span className="font-medium">{amount.toFixed(6)} {fromCoin}</span>
                        {fromUSDValue !== null && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (≈ ${fromUSDValue.toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>
                    {fromPriceUSD !== null && toPriceUSD !== null && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Price: 1 {fromCoin} = ${fromPriceUSD.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Exchange Rate</span>
                      <span className="font-medium">
                        1 {fromCoin} = {exchangeRate.toFixed(8)} {toCoin}
                      </span>
                    </div>
                    {fromPriceUSD !== null && toPriceUSD !== null && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Based on USD prices</span>
                        <span>1 {toCoin} = ${toPriceUSD.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">You Receive</span>
                      <div className="text-right">
                        <span className="font-bold text-lg text-green-600">
                          {calculateToAmount().toFixed(8)} {toCoin}
                        </span>
                        {toUSDValue !== null && (
                          <span className="block text-xs text-muted-foreground mt-1">
                            ≈ ${toUSDValue.toFixed(2)} USD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Show USD equivalence */}
                  {fromUSDValue !== null && toUSDValue !== null && (
                    <div className="rounded-md bg-green-50 p-2 text-xs text-green-900 dark:bg-green-950 dark:text-green-100">
                      <p className="font-medium">USD Value:</p>
                      <p>
                        You&rsquo;re swapping ${fromUSDValue.toFixed(2)} worth of {fromCoin} for ${toUSDValue.toFixed(2)} worth of {toCoin}
                      </p>
                    </div>
                  )}
                </div>
                <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">
                  <p className="font-medium">Note:</p>
                  <p className="mt-1">
                    Exchange rates are fetched in real-time from CoinGecko. Swap requests require admin approval. 
                    The final rate will be recalculated at the time of processing to ensure accuracy.
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

