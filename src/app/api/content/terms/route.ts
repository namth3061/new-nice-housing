import { NextResponse } from "next/server";
import * as Content from "@/models/Content";

export async function GET() {
  try {
    const list = await Content.findAllTermsSections();
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/content/terms", e);
    return NextResponse.json({ error: "Failed to fetch terms" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id: sectionId, title, content } = body;
    if (!sectionId) return NextResponse.json({ error: "section id required" }, { status: 400 });
    const updated = await Content.updateTermsSection(sectionId, { title, content });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/content/terms", e);
    return NextResponse.json({ error: "Failed to update terms" }, { status: 500 });
  }
}
