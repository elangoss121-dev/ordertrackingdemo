import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/track", "/unauthorized"];
const adminRoutes = ["/admin"];
const userRoutes = ["/dashboard"];

function isPublicRoute(pathname: string): boolean {
  if (publicRoutes.includes(pathname)) return true;
  if (pathname.startsWith("/track")) return true;
  if (pathname.startsWith("/api/orders/search")) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  return false;
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => pathname.startsWith(route));
}

function isUserRoute(pathname: string): boolean {
  return userRoutes.some((route) => pathname.startsWith(route));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (isPublicRoute(pathname)) {
    return response;
  }

  const token = request.cookies.get("session-token")?.value;

  if (!token) {
    if (isAdminRoute(pathname) || isUserRoute(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    if (isAdminRoute(pathname) && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (isUserRoute(pathname) && role !== "USER") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (
      (pathname === "/login" || pathname === "/register") &&
      (role === "ADMIN" || role === "USER")
    ) {
      const redirectTo = role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    return response;
  } catch {
    if (isAdminRoute(pathname) || isUserRoute(pathname)) {
      const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
      redirectResponse.cookies.delete("session-token");
      return redirectResponse;
    }
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
