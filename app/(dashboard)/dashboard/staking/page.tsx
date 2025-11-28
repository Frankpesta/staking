"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stakeSchema, type StakeInput } from "@/lib/validations/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CoinSelector } from "@/components/shared/CoinSelector";
import { DEFAULT_STAKING_OPTIONS } from "@/lib/constants";
import { useQuery as useAppSettings } from "convex/react";

export default function StakingPage() {
  const { user } = useAuth();
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const balance = useQuery(
    api.balances.getUserBalance,
    user?._id ? { userId: user._id } : "skip"
  );

  const appSettings = useQuery(api.appSettings.getAppSettings);
  const stakingOptions = appSettings?.stakingOptions || DEFAULT_STAKING_OPTIONS;

  const createStakingPoolMutation = useMutation(api.staking.createStakingPool);
  const userPools = useQuery(
    api.staking.getUserStakingPools,
    user?._id ? { userId: user._id, status: "active" } : "skip"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<StakeInput>({
    resolver: zodResolver(stakeSchema),
  });

  useEffect(() => {
    register("coin", { required: "Coin is required" });
  }, [register]);

  const amount = watch("amount");
  const availableBalance = balance?.availableBalance as Record<string, number> | undefined;
  const currentBalance = selectedCoin ? (availableBalance?.[selectedCoin] || 0) : 0;

  const selectedOption = stakingOptions.find((opt) => opt.duration === selectedDuration);

  const calculateROI = () => {
    if (!amount || !selectedOption) return 0;
    return (amount * selectedOption.roiPercentage) / 100;
  };

  const calculateTotalReturn = () => {
    if (!amount || !selectedOption) return 0;
    return amount + calculateROI();
  };

  const onSubmit = async (data: StakeInput) => {
    if (!user?._id || !selectedDuration) return;

    if (currentBalance < data.amount) {
      setError("Insufficient balance");
      return;
    }

    const selectedOption = stakingOptions.find((opt) => opt.duration === selectedDuration);
    if (!selectedOption) {
      setError("Invalid staking duration");
      return;
    }

    try {
      setError(null);
      await createStakingPoolMutation({
        userId: user._id,
        coin: data.coin,
        amount: data.amount,
        duration: selectedDuration,
        roiPercentage: selectedOption.roiPercentage,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setValue("amount", 0);
        setSelectedCoin("");
        setSelectedDuration(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create staking pool");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Staking</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Stake your coins and earn fixed returns
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Staking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Staking Pool</CardTitle>
            <CardDescription>
              Select coin, amount, and duration
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
                  Staking pool created successfully!
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Coin</label>
                <CoinSelector
                  value={selectedCoin}
                  onValueChange={(value) => {
                    setSelectedCoin(value);
                    setValue("coin", value, { shouldDirty: true, shouldValidate: true });
                  }}
                  balances={availableBalance}
                  filterByBalance={true}
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
                <label className="text-sm font-medium">Staking Duration</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {stakingOptions.map((option) => (
                    <Button
                      key={option.duration}
                      type="button"
                      variant={selectedDuration === option.duration ? "default" : "outline"}
                      onClick={() => {
                        setSelectedDuration(option.duration);
                        setValue("duration", option.duration);
                      }}
                      className="flex flex-col items-center gap-1 h-auto py-2 sm:py-3 text-xs sm:text-sm"
                    >
                      <span className="font-semibold whitespace-nowrap">{option.duration}d</span>
                      <span className="text-xs opacity-80">{option.roiPercentage}%</span>
                    </Button>
                  ))}
                </div>
                {errors.duration && (
                  <p className="text-sm text-destructive">{errors.duration.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !selectedCoin || !selectedDuration}
              >
                {isSubmitting ? "Creating..." : "Create Staking Pool"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ROI Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>ROI Calculator</CardTitle>
            <CardDescription>
              Preview your returns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {amount && selectedOption ? (
              <>
                <div className="space-y-2 rounded-md border p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Principal</span>
                    <span className="font-medium">{amount.toFixed(6)} {selectedCoin}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{selectedDuration} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ROI Percentage</span>
                    <span className="font-medium">{selectedOption.roiPercentage}%</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROI Amount</span>
                      <span className="font-semibold text-green-600">
                        +{calculateROI().toFixed(6)} {selectedCoin}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Return</span>
                      <span className="font-bold text-lg">
                        {calculateTotalReturn().toFixed(6)} {selectedCoin}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">
                  <p className="font-medium">Note:</p>
                  <p className="mt-1">
                    Funds will be locked for {selectedDuration} days. You&rsquo;ll receive principal + ROI at maturity.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
                <p className="text-sm text-muted-foreground">
                  Enter amount and select duration to see ROI calculation
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Staking Pools */}
      {userPools && userPools.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Staking Pools</CardTitle>
            <CardDescription>Your currently active staking pools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userPools.map((pool) => {
                const daysRemaining = Math.ceil((pool.endDate - Date.now()) / (24 * 60 * 60 * 1000));
                const progress = ((Date.now() - pool.startDate) / (pool.endDate - pool.startDate)) * 100;
                return (
                  <div key={pool._id} className="rounded-lg border p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-sm sm:text-base">
                          {pool.amount.toFixed(6)} {pool.coin}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {pool.duration} days • {pool.roiPercentage}% ROI
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs sm:text-sm font-medium">{daysRemaining} days left</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Matures: {new Date(pool.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

