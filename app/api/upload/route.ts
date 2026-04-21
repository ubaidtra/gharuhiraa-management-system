import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RECEIPT_UPLOAD_BUCKET, supabase } from "@/lib/supabase";
import {
  ensureReceiptBucket,
  getReceiptPublicUrl,
} from "@/lib/utils/storage";
import { buildReceiptObjectPath, validateReceiptFile } from "@/lib/utils/receiptUpload";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ACCOUNTS") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const validation = validateReceiptFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await ensureReceiptBucket();

    const storagePath = buildReceiptObjectPath(file.name);
    const { error } = await supabase.storage
      .from(RECEIPT_UPLOAD_BUCKET)
      .upload(storagePath, file, { contentType: file.type, upsert: false });
    if (error) throw error;

    return NextResponse.json({
      success: true,
      url: getReceiptPublicUrl(storagePath),
      filename: storagePath.split("/").pop(),
      path: storagePath,
      bucket: RECEIPT_UPLOAD_BUCKET,
    });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
