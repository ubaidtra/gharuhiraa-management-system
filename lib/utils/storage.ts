import { RECEIPT_UPLOAD_BUCKET, supabase } from "@/lib/supabase";
import { getReceiptUploadConstraints } from "@/lib/utils/receiptUpload";

let bucketReady: Promise<void> | null = null;

export async function ensureReceiptBucket() {
  if (!bucketReady) {
    bucketReady = (async () => {
      const { allowedMimeTypes, maxUploadSize } = getReceiptUploadConstraints();
      const { data, error } = await supabase.storage.getBucket(RECEIPT_UPLOAD_BUCKET);
      if (data && !error) return;

      const { error: createError } = await supabase.storage.createBucket(RECEIPT_UPLOAD_BUCKET, {
        public: true,
        fileSizeLimit: maxUploadSize,
        allowedMimeTypes,
      });

      if (createError && createError.message !== "The resource already exists") {
        throw createError;
      }
    })();
  }

  return bucketReady;
}

export function getReceiptPublicUrl(path: string) {
  return supabase.storage.from(RECEIPT_UPLOAD_BUCKET).getPublicUrl(path).data.publicUrl;
}
