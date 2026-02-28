import { NextResponse } from "next/server";
import * as Booking from "@/models/Booking";

// [id] is booking code (e.g. BK-1001)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const code = (await params).id;
    if (!code) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const row = await Booking.findBookingByCode(code);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    console.error("GET /api/bookings/[id]", e);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const code = (await params).id;
    if (!code) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const existing = await Booking.findBookingByCode(code);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await request.json();
    const hasUpdates =
      body.status !== undefined ||
      body.guest !== undefined ||
      body.email !== undefined ||
      body.phone !== undefined ||
      body.note !== undefined;
    if (hasUpdates) {
      const updated = await Booking.updateBooking(existing.dbId, {
        status: body.status,
        guest: body.guest,
        email: body.email,
        phone: body.phone,
        note: body.note,
      });
      return NextResponse.json(updated);
    }
    return NextResponse.json(existing);
  } catch (e) {
    console.error("PATCH /api/bookings/[id]", e);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const code = (await params).id;
    if (!code) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const existing = await Booking.findBookingByCode(code);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const deleted = await Booking.deleteBooking(existing.dbId);
    if (!deleted) return NextResponse.json({ error: "Delete failed" }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/bookings/[id]", e);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
