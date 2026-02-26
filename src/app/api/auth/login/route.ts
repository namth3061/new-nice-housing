import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import * as User from "@/models/User";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days (match JWT)

/** Admin login: credentials are validated against the users table only (role=admin, password_hash). */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập email và mật khẩu" },
        { status: 400 }
      );
    }

    const user = await User.findUserByEmailForAuth(email);
    if (!user) {
      console.warn("[auth/login] No user for email:", email);
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    const row = user as Record<string, unknown>;
    const hashKey = Object.keys(row).find((k) => k.toLowerCase() === "password_hash");
    const passwordHash = (hashKey ? row[hashKey] : user.password_hash ?? row?.password_hash ?? "") as string;
    if (!passwordHash || typeof passwordHash !== "string") {
      console.warn("[auth/login] User found but no password_hash. Keys:", Object.keys(row));
      return NextResponse.json(
        { error: "Tài khoản chưa được cấu hình đăng nhập" },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, passwordHash);
    if (!match) {
      console.warn("[auth/login] Password mismatch for email:", email, "hash length:", passwordHash.length);
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập cổng quản trị" },
        { status: 403 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { error: "Tài khoản đã bị khóa" },
        { status: 403 }
      );
    }

    const token = signAdminToken({ sub: user.id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("POST /api/auth/login", e);
    return NextResponse.json({ error: "Lỗi đăng nhập" }, { status: 500 });
  }
}
