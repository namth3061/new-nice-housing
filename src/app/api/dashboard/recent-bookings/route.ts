import { NextResponse } from "next/server";
import * as Booking from "@/models/Booking";

export async function GET() {
  try {
    const list = await Booking.findAllBookings({});
    const recent = list.slice(0, 5);
    return NextResponse.json(recent);
  } catch (e) {
    console.error("GET /api/dashboard/recent-bookings", e);
    return NextResponse.json({ error: "Failed to fetch recent bookings" }, { status: 500 });
  }
}
