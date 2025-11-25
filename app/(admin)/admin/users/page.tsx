"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Calendar, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery as useBalanceQuery } from "convex/react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  const users = useQuery(api.users.listUsers);
  const filteredUsers = users?.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage all platform users
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers?.length || 0})</CardTitle>
          <CardDescription>
            View and manage user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers && filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 cursor-pointer"
                  onClick={() => setSelectedUser(user._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{user.email}</p>
                        {user.role === "super_admin" && (
                          <Badge variant="secondary">Admin</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          KYC: {user.kycStatus}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                        {user.emailVerified ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
              <p className="text-sm text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <UserDetailDialog
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

function UserDetailDialog({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const user = useQuery(api.users.getUserById, { userId: userId as any });
  const balance = useQuery(
    api.balances.getUserBalance,
    user?._id ? { userId: user._id } : "skip"
  );
  const transactions = useQuery(
    api.transactions.getUserTransactions,
    user?._id ? { userId: user._id, limit: 10 } : "skip"
  );

  if (!user) return null;

  const availableBalance = balance?.availableBalance as Record<string, number> | undefined;
  const stakedBalance = balance?.stakedBalance as Record<string, number> | undefined;

  return (
    <Dialog open={!!userId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Complete information for {user.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Account Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Verified</p>
                <p className="font-medium">{user.emailVerified ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">KYC Status</p>
                <p className="font-medium capitalize">{user.kycStatus}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Balances */}
          {balance && (
            <div className="space-y-4">
              <h3 className="font-semibold">Balances</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-lg font-semibold">
                    {Object.entries(availableBalance || {})
                      .filter(([_, v]) => v > 0)
                      .map(([coin, amount]) => `${amount.toFixed(4)} ${coin}`)
                      .join(", ") || "0"}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Staked</p>
                  <p className="text-lg font-semibold">
                    {Object.entries(stakedBalance || {})
                      .filter(([_, v]) => v > 0)
                      .map(([coin, amount]) => `${amount.toFixed(4)} ${coin}`)
                      .join(", ") || "0"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {transactions && transactions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Recent Transactions</h3>
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx._id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium capitalize">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.amount.toFixed(6)} {tx.coin}
                      </p>
                    </div>
                    <Badge>{tx.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

