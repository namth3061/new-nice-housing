import { NextResponse } from "next/server";
import * as User from "@/models/User";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const row = await User.findUserById(id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    console.error("GET /api/users/[id]", e);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const body = await request.json();
    const updated = await User.updateUser(id, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: body.role,
      status: body.status,
    });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/users/[id]", e);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const ok = await User.deleteUser(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/users/[id]", e);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
