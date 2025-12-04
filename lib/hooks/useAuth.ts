"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { getAuthToken, removeAuthToken } from "@/lib/utils/cookies";

export function useAuth() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = getAuthToken();
      setToken(storedToken);
      setIsLoading(false);
      
      // Debug: Log token status
      if (!storedToken) {
        console.log("[useAuth] No token found in localStorage");
      } else {
        console.log("[useAuth] Token found, length:", storedToken.length);
      }
    }
  }, []);

  const user = useQuery(
    api.users.getCurrentUser,
    token ? { token } : "skip"
  );

  // Debug logging (remove in production)
  useEffect(() => {
    if (typeof window !== "undefined" && token) {
      if (user === null) {
        console.warn("[useAuth] Token exists but user is null - session may be expired");
      } else if (user === undefined) {
        console.log("[useAuth] User query is loading...");
      } else {
        console.log("[useAuth] User loaded:", user.email);
      }
    }
  }, [user, token]);

  const logout = async () => {
    // Clear cookie via API route
    try {
      await fetch("/api/auth/set-cookie", { method: "DELETE" });
    } catch (error) {
      console.error("Failed to clear cookie:", error);
    }
    
    // Clear local storage and state
    removeAuthToken();
    setToken(null);
    // Force a full page reload to ensure all state is cleared and UI updates
    window.location.href = "/login";
  };

  // Determine loading state: initial load OR token exists but user query hasn't resolved yet
  const isUserLoading = isLoading || (token !== null && user === undefined);

  return {
    user,
    token,
    isLoading: isUserLoading,
    isAuthenticated: !!user,
    logout,
  };
}

