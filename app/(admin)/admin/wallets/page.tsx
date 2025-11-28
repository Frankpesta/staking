"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, CheckCircle, XCircle, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const walletSchema = z.object({
  coin: z.string().min(1, "Coin is required"),
  chainId: z.number().min(1, "Chain ID is required"),
  address: z.string().min(1, "Address is required"),
});

type WalletInput = z.infer<typeof walletSchema>;

export default function AdminWalletsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const wallets = useQuery(api.platformWallets.listPlatformWallets);
  const createWalletMutation = useMutation(api.platformWallets.createPlatformWallet);
  const updateWalletMutation = useMutation(api.platformWallets.updatePlatformWallet);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<WalletInput>({
    resolver: zodResolver(walletSchema),
  });

  const onSubmit = async (data: WalletInput) => {
    try {
      if (editingWallet) {
        await updateWalletMutation({
          walletId: editingWallet as any,
          coin: data.coin,
          chainId: data.chainId,
          address: data.address,
        });
        setEditingWallet(null);
      } else {
        await createWalletMutation({
          coin: data.coin,
          chainId: data.chainId,
          address: data.address,
        });
      }
      reset();
      setIsOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save wallet");
    }
  };

  const handleEdit = (wallet: any) => {
    setEditingWallet(wallet._id);
    setValue("coin", wallet.coin);
    setValue("chainId", wallet.chainId);
    setValue("address", wallet.address);
    setIsOpen(true);
  };

  const handleCancel = () => {
    setEditingWallet(null);
    reset();
    setIsOpen(false);
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleWallet = async (walletId: string, isActive: boolean) => {
    try {
      await updateWalletMutation({
        walletId: walletId as any,
        isActive: !isActive,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update wallet");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Platform Wallets</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage platform wallet addresses for deposits
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Wallet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingWallet ? "Edit Platform Wallet" : "Add Platform Wallet"}
              </DialogTitle>
              <DialogDescription>
                {editingWallet
                  ? "Update wallet address configuration"
                  : "Configure a new wallet address for receiving deposits"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Coin Symbol</label>
                <Input placeholder="ETH, USDT, etc." {...register("coin")} />
                {errors.coin && (
                  <p className="text-sm text-destructive">{errors.coin.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Chain ID</label>
                <Input
                  type="number"
                  placeholder="1 (Ethereum), 137 (Polygon), etc."
                  {...register("chainId", { valueAsNumber: true })}
                />
                {errors.chainId && (
                  <p className="text-sm text-destructive">{errors.chainId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Address</label>
                <Input placeholder="0x..." {...register("address")} />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Platform wallet address for receiving deposits. Withdrawals are processed manually by admins.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? editingWallet
                      ? "Updating..."
                      : "Creating..."
                    : editingWallet
                    ? "Update Wallet"
                    : "Create Wallet"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configured Wallets</CardTitle>
          <CardDescription>
            Platform wallets for receiving user deposits. Withdrawals are processed manually.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wallets && wallets.length > 0 ? (
            <div className="space-y-4">
              {wallets.map((wallet) => (
                <div
                  key={wallet._id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{wallet.coin}</span>
                      <Badge>Chain ID: {wallet.chainId}</Badge>
                      {wallet.isActive ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-muted-foreground">
                        {wallet.address.slice(0, 20)}...{wallet.address.slice(-10)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(wallet.address)}
                      >
                        {copied === wallet.address ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(wallet)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWallet(wallet._id, wallet.isActive)}
                    >
                      {wallet.isActive ? (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
              <p className="text-sm text-muted-foreground">No wallets configured</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

