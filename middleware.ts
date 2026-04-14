import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth gate for server-side navigations.
 *
 * Dashboard is enforced only on the client (localStorage session + Convex) so mobile
 * browsers that drop the httpOnly cookie but keep localStorage still work.
 * Admin routes still require the cookie set at login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get("auth_token")?.value;

  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/resend-verification",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAdminRoute = pathname.startsWith("/admin");

  if (!isPublicRoute && !authToken && isAdminRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authToken && isPublicRoute && pathname !== "/") {
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
