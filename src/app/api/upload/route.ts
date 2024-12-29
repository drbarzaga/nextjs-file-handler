import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Check if the uploads directory exists, and create it if it doesn't
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // With the file data in the buffer, you can do whatever you want with it.
  // For this example, we'll just write it to the filesystem in a new location
  const filePath = path.join(uploadDir, file.name);
  await writeFile(filePath, buffer);

  return NextResponse.json({ success: true, filename: file.name });
}
