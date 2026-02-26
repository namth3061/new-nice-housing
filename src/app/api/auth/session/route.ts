import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const payload = token ? verifyAdminToken(token) : null;

    if (!payload) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    return NextResponse.json({ ok: true, userId: payload.sub });
  } catch (e) {
    console.error("GET /api/auth/session", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
