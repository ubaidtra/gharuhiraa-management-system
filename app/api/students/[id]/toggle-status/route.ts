import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { data: student, error: fetchErr } = await supabase.from("Student").select("isActive").eq("id", id).single();
    if (fetchErr || !student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const { data: updated, error } = await supabase
      .from("Student")
      .update({ isActive: !student.isActive })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(updated);
  } catch (e) {
    console.error("Error toggling student:", e);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}
