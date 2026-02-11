import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ACCOUNTS" && session.user.role !== "MANAGEMENT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;
    const { error } = await supabase.from("Teacher").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ message: "Teacher deleted" });
  } catch (e) {
    console.error("Error deleting teacher:", e);
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}
