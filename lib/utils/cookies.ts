"use client";

/**
 * Set auth token in cookie (for server-side proxy checks)
 * Note: In production, use httpOnly cookies set via API route
 * This is a client-side helper that sets a regular cookie
 */
export function setAuthToken(token: string) {
  if (typeof document !== "undefined") {
    // Set cookie with 24 hour expiration
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    
    // Also store in localStorage for client-side access
    localStorage.setItem("auth_token", token);
  }
}

/**
 * Get auth token from localStorage (httpOnly cookies can't be read by JS)
 * The httpOnly cookie is used by proxy.ts for server-side checks
 * localStorage is used by useAuth hook for client-side Convex queries
 */
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    // Read from localStorage (httpOnly cookies can't be accessed via document.cookie)
    return localStorage.getItem("auth_token");
  }
  return null;
}

/**
 * Remove auth token from cookie and localStorage
 */
export function removeAuthToken() {
  if (typeof document !== "undefined") {
    // Remove cookie
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Remove from localStorage
    localStorage.removeItem("auth_token");
  }
}

