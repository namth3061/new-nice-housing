import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = "public/uploads";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function getSafeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
  return safe;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Thiếu file ảnh" }, { status: 400 });
    }

    const blob = file as Blob;
    if (blob.size > MAX_SIZE) {
      return NextResponse.json({ error: "Ảnh tối đa 5MB" }, { status: 400 });
    }
    const type = blob.type?.toLowerCase() ?? "";
    if (!type || !ALLOWED_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Chỉ chấp nhận ảnh: JPEG, PNG, GIF, WebP" },
        { status: 400 }
      );
    }

    const name = (file as File).name || "image";
    const filename = getSafeFilename(name);
    const dir = path.join(process.cwd(), UPLOAD_DIR);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error("POST /api/upload/image", e);
    return NextResponse.json({ error: "Lỗi khi tải ảnh lên" }, { status: 500 });
  }
}
