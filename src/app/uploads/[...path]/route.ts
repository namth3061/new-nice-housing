import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function GET(request: Request, context: any) {
    const params = await Promise.resolve(context.params);
    const p = params.path as string[];

    if (!p || p.length === 0) {
        return new NextResponse("Not Found", { status: 404 });
    }

    const filename = p.join("/");

    // Prevent directory traversal
    const normalizedPath = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');

    const filePath = path.join(process.cwd(), "public", "uploads", normalizedPath);

    try {
        if (!fs.existsSync(filePath)) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const fileBuffer = await readFile(filePath);

        // Determine content type
        let contentType = "image/jpeg";
        const ext = path.extname(filePath).toLowerCase();
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".svg") contentType = "image/svg+xml";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch (error) {
        console.error("Error serving uploaded file:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
