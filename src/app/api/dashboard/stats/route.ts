import { NextResponse } from "next/server";
import * as Booking from "@/models/Booking";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const bookingStats = await Booking.getBookingStats();
    const { rows } = await query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM users WHERE created_at >= date_trunc('month', CURRENT_DATE)"
    );
    const newUsersThisMonth = Number(rows[0]?.count ?? 0);
    return NextResponse.json({
      totalRevenue: bookingStats.totalRevenue,
      totalBookings: bookingStats.totalBookings,
      pendingCount: bookingStats.pendingCount,
      newUsersThisMonth,
    });
  } catch (e) {
    console.error("GET /api/dashboard/stats", e);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
