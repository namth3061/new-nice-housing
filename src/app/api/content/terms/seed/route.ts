import { NextResponse } from "next/server";
import * as Content from "@/models/Content";
import { TERMS_SECTIONS } from "@/data/terms";

export async function POST() {
  try {
    let count = 0;
    for (let i = 0; i < TERMS_SECTIONS.length; i++) {
      const s = TERMS_SECTIONS[i];
      await Content.upsertTermsSection(s.id, s.title, s.content, i + 1);
      count++;
    }
    return NextResponse.json({ ok: true, count });
  } catch (e) {
    console.error("POST /api/content/terms/seed", e);
    return NextResponse.json({ error: "Failed to seed terms" }, { status: 500 });
  }
}
