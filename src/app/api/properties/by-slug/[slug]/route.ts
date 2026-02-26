import { NextResponse } from "next/server";
import * as Property from "@/models/Property";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    if (!slug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    const row = await Property.findPropertyBySlug(slug);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    console.error("GET /api/properties/by-slug/[slug]", e);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}
