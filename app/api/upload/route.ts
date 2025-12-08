import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Only ACCOUNTS users can upload
  if (!session || session.user.role !== "ACCOUNTS") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image file (JPEG, PNG, GIF, WebP)" },
        { status: 400 }
      );
    }

    // Validate file size (max 4MB for Vercel compatibility)
    const maxSize = 4 * 1024 * 1024; // 4MB (Vercel limit)
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 4MB" },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `check_${timestamp}_${randomString}.${extension}`;

    // For Vercel: Use /tmp directory (writable in serverless)
    // For local dev: Use public/uploads/checks
    const isVercel = process.env.VERCEL === "1";
    const uploadDir = isVercel
      ? path.join("/tmp", "uploads", "checks")
      : path.join(process.cwd(), "public", "uploads", "checks");

    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL
    // Note: On Vercel, files in /tmp are temporary and will be deleted
    // For production, consider using cloud storage (S3, Cloudinary, etc.)
    const publicUrl = isVercel 
      ? `/api/uploaded-file?file=${filename}` // Would need a separate route to serve from /tmp
      : `/uploads/checks/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      warning: isVercel ? "File uploaded to temporary storage. Consider using cloud storage for production." : undefined,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file. Please try again or use a smaller file." },
      { status: 500 }
    );
  }
}

