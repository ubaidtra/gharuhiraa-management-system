import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ACCOUNTS" && session.user.role !== "MANAGEMENT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;
    const { data, error } = await supabase
      .from("Transaction")
      .select("*, Student(*)")
      .eq("id", id)
      .single();
    if (error || !data) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    console.error("Error fetching transaction:", e);
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 });
  }
}
