import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 10 MB file upload limit in bytes
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "video/webm",
  "video/mp4",
  "audio/webm",
  "audio/mpeg"
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Please attach your handwritten proof or notes." },
        { status: 400 }
      );
    }

    // Strict 10 MB Limit Check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          error: `File size (${sizeMb} MB) exceeds maximum upload limit of 10 MB. Please compress or optimize your document.`,
          maxAllowedMb: 10,
          currentSizeMb: sizeMb
        },
        { status: 413 }
      );
    }

    // Type validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file type (${file.type}). Allowed formats: PDF, PNG, JPEG, WEBP, MP4, WebM.`
        },
        { status: 400 }
      );
    }

    // Prepare upload directory in public
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate sanitized unique filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}_${safeName}`;
    const destinationPath = path.join(uploadDir, uniqueFileName);

    // Write file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl
      }
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file upload: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
