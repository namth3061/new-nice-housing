import { NextResponse } from "next/server";
import * as User from "@/models/User";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const list = await User.findAllUsers({ role, search });
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/users", e);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await User.createUser({
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: body.role,
      status: body.status,
    });
    if (!created) return NextResponse.json({ error: "Create failed" }, { status: 400 });
    return NextResponse.json(created);
  } catch (e) {
    console.error("POST /api/users", e);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
