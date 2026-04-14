"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getAuthToken, removeAuthToken } from "@/lib/utils/cookies";

/** Mirrors `users.getCurrentUser` query shape. */
export type CurrentUser = {
  _id: Id<"users">;
  email: string;
  role: "user" | "super_admin";
  emailVerified: boolean;
  kycStatus: "pending" | "approved" | "rejected" | "not_started";
  twoFactorEnabled: boolean;
};

type AuthContextValue = {
  user: CurrentUser | null | undefined;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  /** Re-read token from localStorage (e.g. after login writes storage before navigation). */
  refreshTokenFromStorage: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [token, setTokenState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    setTokenState(getAuthToken());
    setHydrated(true);
  }, [pathname]);

  const user = useQuery(api.users.getCurrentUser, token ? { token } : "skip");

  useEffect(() => {
    if (!token) return;
    void fetch("/api/auth/set-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => {});
  }, [token]);

  const isLoading =
    !hydrated || (token !== null && user === undefined);
  const isAuthenticated = !!user;

  const refreshTokenFromStorage = useCallback(() => {
    setTokenState(getAuthToken());
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/set-cookie", { method: "DELETE" });
    } catch {
      /* ignore */
    }
    removeAuthToken();
    setTokenState(null);
    window.location.href = "/";
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated,
      logout,
      refreshTokenFromStorage,
    }),
    [user, token, isLoading, isAuthenticated, logout, refreshTokenFromStorage]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
