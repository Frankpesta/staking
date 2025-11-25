import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 proxy.ts (replaces middleware.ts)
 * Handles request interception for authentication and authorization
 * 
 * This runs on the Edge runtime and intercepts requests before they reach your pages
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from httpOnly cookie (set by /api/auth/set-cookie)
  // Note: This cookie is httpOnly so it can't be read by client-side JS
  // Client-side code uses localStorage instead (see useAuth hook)
  const authToken = request.cookies.get("auth_token")?.value;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/resend-verification",
  ];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));

  // Admin routes require super_admin role
  const isAdminRoute = pathname.startsWith("/admin");

  // Dashboard routes require authentication
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // If accessing a protected route without auth token, redirect to login
  if (!isPublicRoute && !authToken) {
    if (isAdminRoute || isDashboardRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If accessing auth pages while authenticated, redirect to dashboard
  if (authToken && isPublicRoute && pathname !== "/") {
    // Don't redirect from landing page
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // For admin routes, we'll do basic token check here
  // Full role verification happens client-side in the layout
  // (since we can't easily decode JWT server-side without Convex)
  if (isAdminRoute && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes this proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

