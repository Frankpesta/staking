"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  FileText,
  Clock,
} from "lucide-react";

export default function ActivityPage() {
  const { user } = useAuth();
  const activities = useQuery(
    api.activities.getUserActivities,
    user?._id ? { userId: user._id, limit: 100 } : "skip"
  );

  const getActivityIcon = (type: string) => {
    if (type.includes("deposit")) return <ArrowDown className="h-5 w-5 text-green-600" />;
    if (type.includes("withdrawal")) return <ArrowUp className="h-5 w-5 text-red-600" />;
    if (type.includes("stake")) return <TrendingUp className="h-5 w-5 text-blue-600" />;
    if (type.includes("swap")) return <ArrowLeftRight className="h-5 w-5 text-purple-600" />;
    if (type.includes("kyc")) return <FileText className="h-5 w-5 text-yellow-600" />;
    if (type.includes("login")) return <Wallet className="h-5 w-5 text-gray-600" />;
    return <Clock className="h-5 w-5 text-gray-600" />;
  };

  const getActivityColor = (type: string) => {
    if (type.includes("deposit") || type.includes("approved") || type.includes("completed")) {
      return "border-l-green-500";
    }
    if (type.includes("withdrawal") || type.includes("rejected") || type.includes("failed")) {
      return "border-l-red-500";
    }
    if (type.includes("stake")) {
      return "border-l-blue-500";
    }
    if (type.includes("swap")) {
      return "border-l-purple-500";
    }
    return "border-l-gray-500";
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
        <h1 className="text-3xl font-bold">Activity Feed</h1>
        <p className="text-muted-foreground">
          View all your account activities
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Chronological feed of all your activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities && activities.length > 0 ? (
            <>
              <div className="space-y-4">
                {activities.map((activity: { _id: string; type: string; description: string; timestamp: number }) => (
                  <div
                    key={activity._id}
                    className={`flex items-start gap-4 rounded-lg border-l-4 bg-card p-4 ${getActivityColor(activity.type)}`}
                  >
                    <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Suggestion: Add pagination or infinite scroll for better UX with many activities.
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
              <p className="text-sm text-muted-foreground">
                No activity yet. Deposit funds or start staking to see updates here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
