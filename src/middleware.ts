import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE_NAME = "admin_token";
const JWT_SECRET = process.env.JWT_SECRET ?? "nicehousing-jwt-secret-change-in-production";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/admin/login", request.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(ADMIN_COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
