import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedPaths = ["/portfolio", "/onboarding", "/kyc"];

// Routes that should redirect to dashboard if already authenticated
const authPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/")
  ) {
    return NextResponse.next();
  }

  const hasToken = request.cookies.has("access_token");

  // Protected routes: redirect to /login if no cookie
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  if (isProtected && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes: redirect to /portfolio if already logged in
  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  if (isAuthPage && hasToken) {
    const portfolioUrl = new URL("/portfolio", request.url);
    return NextResponse.redirect(portfolioUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Use a simpler matcher that explicitly excludes API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
