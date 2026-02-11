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
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "TEACHER" && session.user.role !== "MANAGEMENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;
    const { data: report, error } = await supabase
      .from("Report")
      .select("*, Teacher(id, teacherId, firstName, lastName)")
      .eq("id", id)
      .single();
    if (error || !report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
    if (session.user.role === "TEACHER" && report.teacherId !== session.user.teacherId) {
      return NextResponse.json({ error: "Not your report" }, { status: 403 });
    }
    if (session.user.role === "MANAGEMENT" && !report.isRead) {
      await supabase.from("Report").update({ isRead: true }).eq("id", id);
    }
    return NextResponse.json(report);
  } catch (e) {
    console.error("Error fetching report:", e);
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;
    const { data: report } = await supabase.from("Report").select("teacherId").eq("id", id).single();
    if (!report || report.teacherId !== session.user.teacherId) {
      return NextResponse.json({ error: "Not your report" }, { status: 403 });
    }
    const { error } = await supabase.from("Report").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ message: "Report deleted" });
  } catch (e) {
    console.error("Error deleting report:", e);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
