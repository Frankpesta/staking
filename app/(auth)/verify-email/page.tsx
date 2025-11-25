"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const verifyEmailMutation = useMutation(api.users.verifyEmail);

  const token = searchParams.get("token");

  const handleVerify = async () => {
    if (!token) {
      setStatus("error");
      setError("Verification token is missing");
      return;
    }

    setStatus("verifying");
    try {
      await verifyEmailMutation({ token });
      setStatus("success");
      // Redirect to login after verification
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 2000);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Verification failed");
    }
  };

  useEffect(() => {
    // Auto-verify if token is present in URL (from email link)
    if (token && status === "idle") {
      handleVerify();
    } else if (!token && status === "idle") {
      setStatus("error");
      setError("Verification token is missing");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (status === "idle" || status === "verifying") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verifying your email</CardTitle>
            <CardDescription>
              {status === "idle" 
                ? "Click the button below to verify your email address."
                : "Please wait while we verify your email address..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "idle" ? (
              <Button onClick={handleVerify} className="w-full">
                Verify Email
              </Button>
            ) : (
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-green-600">Email verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. Please log in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">Verification failed</CardTitle>
          <CardDescription>
            {error || "Invalid or expired verification token"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The verification link may have expired or is invalid. Please request a new verification email.
          </p>
          <div className="flex gap-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                Go to Login
              </Button>
            </Link>
            <Link href="/resend-verification" className="flex-1">
              <Button className="w-full">Resend Email</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

