import { NextResponse } from "next/server";
import * as Booking from "@/models/Booking";
import { query } from "@/lib/db";

function pct(curr: number, prev: number) {
  if (prev === 0) return curr === 0 ? 0 : 100;
  return Math.round(((curr - prev) / prev) * 1000) / 10;
}

export async function GET() {
  try {
    const [bookingStats, growth, userRows] = await Promise.all([
      Booking.getBookingStats(),
      Booking.getBookingStatsGrowth(),
      query<{ this_month: string; last_month: string }>(
        `SELECT
           COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE))::text AS this_month,
           COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < date_trunc('month', CURRENT_DATE))::text AS last_month
         FROM users`
      ),
    ]);
    const newUsersThisMonth = Number(userRows.rows[0]?.this_month ?? 0);
    const newUsersLastMonth = Number(userRows.rows[0]?.last_month ?? 0);
    const newUsersGrowthPercent = pct(newUsersThisMonth, newUsersLastMonth);

    return NextResponse.json({
      totalRevenue: bookingStats.totalRevenue,
      totalBookings: bookingStats.totalBookings,
      pendingCount: bookingStats.pendingCount,
      newUsersThisMonth,
      revenueGrowthPercent: growth.revenueGrowthPercent,
      bookingsGrowthPercent: growth.bookingsGrowthPercent,
      pendingGrowthPercent: growth.pendingGrowthPercent,
      newUsersGrowthPercent,
    });
  } catch (e) {
    console.error("GET /api/dashboard/stats", e);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
