const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const maxUploadSize = 5 * 1024 * 1024;

export function validateReceiptFile(file: File): { valid: boolean; error?: string } {
  if (!allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Use JPEG, PNG, GIF, or WebP" };
  }

  if (file.size > maxUploadSize) {
    return { valid: false, error: "File too large. Max 5MB" };
  }

  return { valid: true };
}

function normalizeExtension(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
}

export function buildReceiptObjectPath(filename: string) {
  const ext = normalizeExtension(filename);
  return `checks/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
}

export function getReceiptUploadConstraints() {
  return {
    allowedMimeTypes,
    maxUploadSize,
  };
}
