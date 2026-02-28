import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "config", "settings.json");

async function ensureConfigDir() {
    const dir = path.dirname(SETTINGS_FILE);
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (error) {
        // Ignore if exists
    }
}

export async function GET() {
    try {
        await ensureConfigDir();
        const data = await fs.readFile(SETTINGS_FILE, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return NextResponse.json({});
        }
        return NextResponse.json({ error: "Failed to read settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await ensureConfigDir();

        // Read existing to merge
        let currentSettings = {};
        try {
            const data = await fs.readFile(SETTINGS_FILE, "utf-8");
            currentSettings = JSON.parse(data);
        } catch (e) {
            // Ignore if not exists
        }

        const newSettings = { ...currentSettings, ...body };
        await fs.writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), "utf-8");

        return NextResponse.json(newSettings);
    } catch (error) {
        console.error("Failed to save settings", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
