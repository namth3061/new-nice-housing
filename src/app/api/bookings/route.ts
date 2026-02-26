import { NextResponse } from "next/server";
import * as Booking from "@/models/Booking";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const list = await Booking.findAllBookings({ status, search });
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/bookings", e);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = body.code ?? `BK-${Date.now()}`;
    const created = await Booking.createBooking({
      code,
      userId: body.userId ?? body.user_id,
      propertyId: body.propertyId ?? body.property_id,
      guest: body.guest,
      email: body.email,
      phone: body.phone,
      checkIn: body.checkIn ?? body.check_in,
      checkOut: body.checkOut ?? body.check_out,
      nights: body.nights ?? 1,
      guests: body.guests ?? 1,
      total: body.total ?? 0,
      status: body.status,
      note: body.note,
      paymentMethod: body.paymentMethod ?? body.payment_method,
    });
    if (!created) return NextResponse.json({ error: "Create failed" }, { status: 400 });
    return NextResponse.json(created);
  } catch (e) {
    console.error("POST /api/bookings", e);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
