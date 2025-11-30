"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Calendar, Shield, Edit, Trash2, Save, X, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CountrySelector } from "@/components/shared/CountrySelector";
import { PhoneCodeSelector } from "@/components/shared/PhoneCodeSelector";
import { useForm, Controller } from "react-hook-form";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  const users = useQuery(api.users.listUsers, {});
  const filteredUsers = users?.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.accountHolderName1 && user.accountHolderName1.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage all platform users
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by email or name..."
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
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border p-3 sm:p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedUser(user._id)}
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="font-semibold text-sm sm:text-base break-words">{user.email}</p>
                        {user.role === "super_admin" && (
                          <Badge variant="secondary" className="text-xs">Admin</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        {user.accountHolderName1 && (
                          <span>{user.accountHolderName1}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span className="hidden sm:inline">KYC: </span>{user.kycStatus}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                        {user.emailVerified ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs">
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 text-xs">
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm" onClick={(e) => e.stopPropagation()}>
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
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const user = useQuery(api.users.getUserById, { userId: userId as any });
  const balance = useQuery(
    api.balances.getUserBalance,
    user?._id ? { userId: user._id } : "skip"
  );
  const transactions = useQuery(
    api.transactions.getUserTransactions,
    user?._id ? { userId: user._id, limit: 10 } : "skip"
  );

  const updateProfileMutation = useMutation(api.users.updateProfile);
  const deleteUserMutation = useMutation(api.users.deleteUser);
  const getFileUrlMutation = useMutation(api.files.getFileUrl);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      accountHolderName1: "",
      accountHolderName2: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phoneNumber: "",
      phoneCountryCode: "",
      accountType: "",
      hasLLCTrustCorp: false,
      hasCryptoIRA: false,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        accountHolderName1: user.accountHolderName1 || "",
        accountHolderName2: user.accountHolderName2 || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || "",
        phoneNumber: user.phoneNumber || "",
        phoneCountryCode: user.phoneCountryCode || "",
        accountType: user.accountType || "",
        hasLLCTrustCorp: user.hasLLCTrustCorp || false,
        hasCryptoIRA: user.hasCryptoIRA || false,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    const loadProfileImage = async () => {
      if (user?.profileImageId) {
        try {
          const url = await getFileUrlMutation({ fileId: user.profileImageId });
          setProfileImageUrl(url);
        } catch (err) {
          console.error("Failed to load profile image:", err);
        }
      }
    };
    loadProfileImage();
  }, [user?.profileImageId, getFileUrlMutation]);

  const onSubmit = async (data: any) => {
    if (!user?._id) return;

    try {
      setError(null);
      const dateOfBirthTimestamp = data.dateOfBirth
        ? new Date(data.dateOfBirth).getTime()
        : undefined;

      await updateProfileMutation({
        userId: user._id,
        accountHolderName1: data.accountHolderName1,
        accountHolderName2: data.accountHolderName2,
        dateOfBirth: dateOfBirthTimestamp,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        phoneNumber: data.phoneNumber,
        phoneCountryCode: data.phoneCountryCode,
        accountType: data.accountType,
        hasLLCTrustCorp: data.hasLLCTrustCorp,
        hasCryptoIRA: data.hasCryptoIRA,
      });

      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (!user?._id || !confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      setError(null);
      await deleteUserMutation({ userId: user._id });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  if (!user) return null;

  const availableBalance = balance?.availableBalance as Record<string, number> | undefined;
  const stakedBalance = balance?.stakedBalance as Record<string, number> | undefined;

  return (
    <Dialog open={!!userId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Complete information for {user.email}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-900 dark:bg-green-950 dark:text-green-100">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image */}
          {profileImageUrl && (
            <div className="flex justify-center">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border-4 border-border"
              />
            </div>
          )}

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="font-semibold border-b pb-2">Account Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm py-2 px-3 rounded-md bg-muted">{user.email}</p>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <p className="text-sm py-2 px-3 rounded-md bg-muted capitalize">{user.role}</p>
              </div>
              <div className="space-y-2">
                <Label>Email Verified</Label>
                <p className="text-sm py-2 px-3 rounded-md bg-muted">{user.emailVerified ? "Yes" : "No"}</p>
              </div>
              <div className="space-y-2">
                <Label>KYC Status</Label>
                <p className="text-sm py-2 px-3 rounded-md bg-muted capitalize">{user.kycStatus}</p>
              </div>
              <div className="space-y-2">
                <Label>Created At</Label>
                <p className="text-sm py-2 px-3 rounded-md bg-muted">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <h3 className="font-semibold border-b pb-2">Profile Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Account Holder&apos;s Name 1</Label>
                {isEditing ? (
                  <Input {...register("accountHolderName1")} />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.accountHolderName1 || "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Account Holder&apos;s Name 2</Label>
                {isEditing ? (
                  <Input {...register("accountHolderName2")} />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.accountHolderName2 || "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                {isEditing ? (
                  <Input type="date" {...register("dateOfBirth")} />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Account Type</Label>
                {isEditing ? (
                  <Controller
                    name="accountType"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Individual Staking">Individual Staking</SelectItem>
                          <SelectItem value="Digital Wealth Partner">Digital Wealth Partner</SelectItem>
                          <SelectItem value="Joint Ownership Account">Joint Ownership Account</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.accountType || "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                {isEditing ? (
                  <Input {...register("address")} />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.address || "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                {isEditing ? (
                  <Input {...register("city")} />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.city || "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>State</Label>
                {isEditing ? (
                  <Input {...register("state")} />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.state || "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Zip Code</Label>
                {isEditing ? (
                  <Input {...register("zipCode")} />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.zipCode || "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                {isEditing ? (
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <CountrySelector
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    )}
                  />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.country || "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Phone Number</Label>
                {isEditing ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    <Controller
                      name="phoneCountryCode"
                      control={control}
                      render={({ field }) => (
                        <PhoneCodeSelector
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      )}
                    />
                    <Input
                      className="md:col-span-2"
                      type="tel"
                      placeholder="Phone Number"
                      {...register("phoneNumber")}
                    />
                  </div>
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.phoneCountryCode && user.phoneNumber
                      ? `${user.phoneCountryCode} ${user.phoneNumber}`
                      : "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Has LLC, Trust or Corporation?</Label>
                {isEditing ? (
                  <Controller
                    name="hasLLCTrustCorp"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value ? "yes" : "no"}
                        onValueChange={(value) => field.onChange(value === "yes")}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="llc-yes" />
                          <Label htmlFor="llc-yes" className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="llc-no" />
                          <Label htmlFor="llc-no" className="cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.hasLLCTrustCorp ? "Yes" : "No"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Has Crypto IRA?</Label>
                {isEditing ? (
                  <Controller
                    name="hasCryptoIRA"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value ? "yes" : "no"}
                        onValueChange={(value) => field.onChange(value === "yes")}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="ira-yes" />
                          <Label htmlFor="ira-yes" className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="ira-no" />
                          <Label htmlFor="ira-no" className="cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user.hasCryptoIRA ? "Yes" : "No"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Balances */}
          {balance && (
            <div className="space-y-4">
              <h3 className="font-semibold border-b pb-2">Balances</h3>
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
              <h3 className="font-semibold border-b pb-2">Recent Transactions</h3>
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

          {isEditing && (
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
