import { NextResponse } from "next/server";
import * as Content from "@/models/Content";
import { POLICY_SECTIONS } from "@/data/policy";

export async function POST() {
  try {
    let count = 0;
    for (let i = 0; i < POLICY_SECTIONS.length; i++) {
      const s = POLICY_SECTIONS[i];
      await Content.upsertPolicySection(s.id, s.title, s.content, i + 1);
      count++;
    }
    return NextResponse.json({ ok: true, count });
  } catch (e) {
    console.error("POST /api/content/policy/seed", e);
    return NextResponse.json({ error: "Failed to seed policy" }, { status: 500 });
  }
}
