"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { convexApi } from "@/lib/utils/convex-api";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CountrySelector } from "@/components/shared/CountrySelector";
import { PhoneCodeSelector } from "@/components/shared/PhoneCodeSelector";
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const createUserAction = useAction(convexApi.actions?.users?.createUser);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      hasLLCTrustCorp: false,
      hasCryptoIRA: false,
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    try {
      setError(null);
      
      // Convert date string to timestamp
      const dateOfBirthTimestamp = new Date(data.dateOfBirth).getTime();
      
      await createUserAction({
        email: data.email,
        password: data.password,
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
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Account created!</CardTitle>
            <CardDescription>
              We&apos;ve sent a verification email to your inbox. Please check your email and click the verification link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Link href="/resend-verification" className="text-primary hover:underline">
                resend verification email
              </Link>
              .
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted p-4 py-8">
        <Card className="w-full max-w-4xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Sign up to start staking on Truststaking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Account Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Account Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Holder Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Account Holder Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName1">Account Holder&apos;s Name 1 *</Label>
                    <Input
                      id="accountHolderName1"
                      placeholder="Full Name"
                      {...register("accountHolderName1")}
                    />
                    {errors.accountHolderName1 && (
                      <p className="text-sm text-destructive">{errors.accountHolderName1.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName2">Account Holder&apos;s Name 2</Label>
                    <Input
                      id="accountHolderName2"
                      placeholder="Full Name (Optional)"
                      {...register("accountHolderName2")}
                    />
                    {errors.accountHolderName2 && (
                      <p className="text-sm text-destructive">{errors.accountHolderName2.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type *</Label>
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
                    {errors.accountType && (
                      <p className="text-sm text-destructive">{errors.accountType.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Street Address"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="State/Province"
                      {...register("state")}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input
                      id="zipCode"
                      placeholder="Zip/Postal Code"
                      {...register("zipCode")}
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-destructive">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
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
                  {errors.country && (
                    <p className="text-sm text-destructive">{errors.country.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="phoneCountryCode">Country Code *</Label>
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
                    {errors.phoneCountryCode && (
                      <p className="text-sm text-destructive">{errors.phoneCountryCode.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Phone Number"
                      {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Do you have an LLC, Trust or Corporation? *</Label>
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
                    {errors.hasLLCTrustCorp && (
                      <p className="text-sm text-destructive">{errors.hasLLCTrustCorp.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Do you have Crypto IRA? *</Label>
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
                    {errors.hasCryptoIRA && (
                      <p className="text-sm text-destructive">{errors.hasCryptoIRA.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <Controller
                  name="termsAccepted"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Use
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy-policy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                        *
                      </Label>
                    </div>
                  )}
                />
                {errors.termsAccepted && (
                  <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
