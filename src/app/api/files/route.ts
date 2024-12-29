import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";
import fs from "fs";

export async function GET() {
  const uploadDir = path.join(process.cwd(), "uploads");

  try {
    // Check if the directory exists before reading it, if it doesn't exist return an empty array
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = await readdir(uploadDir);
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error reading directory:", error);
    return NextResponse.json({ error: "Error reading files" }, { status: 500 });
  }
}
