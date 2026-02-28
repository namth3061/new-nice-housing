import { NextResponse } from "next/server";
import * as Property from "@/models/Property";

export async function GET() {
  try {
    const provinces = await Property.getDistinctProvinces();
    return NextResponse.json(provinces);
  } catch (e) {
    console.error("GET /api/properties/provinces", e);
    return NextResponse.json({ error: "Failed to fetch provinces" }, { status: 500 });
  }
}
