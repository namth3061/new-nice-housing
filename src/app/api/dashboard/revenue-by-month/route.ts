import { NextResponse } from "next/server";
import * as Booking from "@/models/Booking";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") ?? "month") as Booking.RevenuePeriod;
    const validPeriod = ["week", "month", "year"].includes(period) ? period : "month";
    const data = await Booking.getRevenueByPeriod(validPeriod);
    return NextResponse.json(data);
  } catch (e) {
    console.error("GET /api/dashboard/revenue-by-month", e);
    return NextResponse.json({ error: "Failed to fetch revenue by month" }, { status: 500 });
  }
}
