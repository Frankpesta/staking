"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AdminStakingPage() {
  const activePools = useQuery(api.staking.getAllStakingPools, { status: "active" });
  const completedPools = useQuery(api.staking.getAllStakingPools, { status: "completed" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staking Pools</h1>
        <p className="text-muted-foreground">
          Monitor all active and completed staking pools
        </p>
      </div>

      {/* Active Pools */}
      <Card>
        <CardHeader>
          <CardTitle>Active Staking Pools ({activePools?.length || 0})</CardTitle>
          <CardDescription>
            Currently active staking pools
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activePools && activePools.length > 0 ? (
            <div className="space-y-4">
              {activePools.map((pool) => {
                const daysRemaining = Math.ceil(
                  (pool.endDate - Date.now()) / (24 * 60 * 60 * 1000)
                );
                const progress =
                  ((Date.now() - pool.startDate) / (pool.endDate - pool.startDate)) * 100;
                const expectedReturn = (pool.amount * pool.roiPercentage) / 100;

                return (
                  <div key={pool._id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            {pool.amount.toFixed(6)} {pool.coin}
                          </span>
                          <Badge>{pool.duration} days</Badge>
                          <Badge variant="secondary">{pool.roiPercentage}% ROI</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Expected return: {expectedReturn.toFixed(6)} {pool.coin}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{daysRemaining} days left</p>
                        <p className="text-xs text-muted-foreground">
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
                      <p className="text-xs text-muted-foreground mt-1">
                        {progress.toFixed(1)}% complete
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
              <p className="text-sm text-muted-foreground">No active staking pools</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Pools */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Staking Pools ({completedPools?.length || 0})</CardTitle>
          <CardDescription>
            Recently completed staking pools
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedPools && completedPools.length > 0 ? (
            <div className="space-y-4">
              {completedPools.slice(0, 20).map((pool) => (
                <div key={pool._id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {pool.amount.toFixed(6)} {pool.coin}
                        </span>
                        <Badge variant="secondary">{pool.duration} days</Badge>
                      </div>
                      {pool.maturedAmount && (
                        <p className="text-sm text-muted-foreground">
                          Matured: {pool.maturedAmount.toFixed(6)} {pool.coin}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Completed
                      </Badge>
                      {pool.completedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(pool.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
              <p className="text-sm text-muted-foreground">No completed staking pools</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

