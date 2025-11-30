"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CountrySelector } from "@/components/shared/CountrySelector";
import { PhoneCodeSelector } from "@/components/shared/PhoneCodeSelector";
import { Upload, Edit, Save, X, User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const userProfile = useQuery(
    api.users.getUserById,
    user?._id ? { userId: user._id } : "skip"
  );

  const updateProfileMutation = useMutation(api.users.updateProfile);
  const generateUploadUrlMutation = useMutation(api.files.generateUploadUrl);
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
    if (userProfile) {
      reset({
        accountHolderName1: userProfile.accountHolderName1 || "",
        accountHolderName2: userProfile.accountHolderName2 || "",
        dateOfBirth: userProfile.dateOfBirth
          ? new Date(userProfile.dateOfBirth).toISOString().split("T")[0]
          : "",
        address: userProfile.address || "",
        city: userProfile.city || "",
        state: userProfile.state || "",
        zipCode: userProfile.zipCode || "",
        country: userProfile.country || "",
        phoneNumber: userProfile.phoneNumber || "",
        phoneCountryCode: userProfile.phoneCountryCode || "",
        accountType: userProfile.accountType || "",
        hasLLCTrustCorp: userProfile.hasLLCTrustCorp || false,
        hasCryptoIRA: userProfile.hasCryptoIRA || false,
      });
    }
  }, [userProfile, reset]);

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      if (userProfile?.profileImageId) {
        try {
          const url = await getFileUrlMutation({ fileId: userProfile.profileImageId });
          setProfileImageUrl(url);
        } catch (err) {
          console.error("Failed to load profile image:", err);
        }
      }
    };
    loadProfileImage();
  }, [userProfile?.profileImageId, getFileUrlMutation]);

  const handleImageUpload = async (file: File) => {
    if (!user?._id) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const uploadUrl = await generateUploadUrlMutation();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await updateProfileMutation({
        userId: user._id,
        profileImageId: storageId,
      });

      const url = await getFileUrlMutation({ fileId: storageId });
      setProfileImageUrl(url);
      setUploadingImage(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
      setUploadingImage(false);
    }
  };

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

  if (!user || !userProfile) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage your profile information
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

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

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Profile Image Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
            <CardDescription>Upload your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-border"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={uploadingImage}
                />
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingImage}
                    asChild
                  >
                    <span>
                      {uploadingImage ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </>
                      )}
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your profile information"
                : "Your profile details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName1">Account Holder&apos;s Name 1</Label>
                  {isEditing ? (
                    <Input
                      id="accountHolderName1"
                      {...register("accountHolderName1")}
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 rounded-md bg-muted">
                      {userProfile.accountHolderName1 || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolderName2">Account Holder&apos;s Name 2</Label>
                  {isEditing ? (
                    <Input
                      id="accountHolderName2"
                      {...register("accountHolderName2")}
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 rounded-md bg-muted">
                      {userProfile.accountHolderName2 || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 rounded-md bg-muted">
                      {userProfile.dateOfBirth
                        ? new Date(userProfile.dateOfBirth).toLocaleDateString()
                        : "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
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
                      {userProfile.accountType || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input id="address" {...register("address")} />
                  ) : (
                    <p className="text-sm py-2 px-3 rounded-md bg-muted">
                      {userProfile.address || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {isEditing ? (
                    <Input id="city" {...register("city")} />
                  ) : (
                    <p className="text-sm py-2 px-3 rounded-md bg-muted">
                      {userProfile.city || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  {isEditing ? (
                    <Input id="state" {...register("state")} />
                  ) : (
                    <p className="text-sm py-2 px-3 rounded-md bg-muted">
                      {userProfile.state || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  {isEditing ? (
                    <Input id="zipCode" {...register("zipCode")} />
                  ) : (
                    <p className="text-sm py-2 px-3 rounded-md bg-muted">
                      {userProfile.zipCode || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
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
                      {userProfile.country || "Not set"}
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
                      {userProfile.phoneCountryCode && userProfile.phoneNumber
                        ? `${userProfile.phoneCountryCode} ${userProfile.phoneNumber}`
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
                      {userProfile.hasLLCTrustCorp ? "Yes" : "No"}
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
                      {userProfile.hasCryptoIRA ? "Yes" : "No"}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

