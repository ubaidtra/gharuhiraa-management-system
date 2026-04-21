import { createClient } from "@supabase/supabase-js";

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

export const RECEIPT_UPLOAD_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "receipts";

export const supabase = createClient(
  requireEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv(supabaseKey, "SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: "public" },
  }
);
