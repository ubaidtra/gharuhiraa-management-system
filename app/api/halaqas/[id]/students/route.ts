import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id: halaqaId } = await params;
    const { data: halaqa } = await supabase.from("Halaqa").select("teacherId").eq("id", halaqaId).single();
    if (!halaqa || halaqa.teacherId !== session.user.teacherId) {
      return NextResponse.json({ error: "You can only manage students in your halaqa" }, { status: 403 });
    }
    const body = await request.json();
    const { studentId } = body;
    if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });
    const { data: student, error } = await supabase
      .from("Student")
      .update({ halaqaId })
      .eq("id", studentId)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(student);
  } catch (e) {
    console.error("Error adding student:", e);
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 });
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
    const { id: halaqaId } = await params;
    const studentId = request.nextUrl.searchParams.get("studentId");
    if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });
    const { data: halaqa } = await supabase.from("Halaqa").select("teacherId").eq("id", halaqaId).single();
    if (!halaqa || halaqa.teacherId !== session.user.teacherId) {
      return NextResponse.json({ error: "You can only manage students in your halaqa" }, { status: 403 });
    }
    const { data: student, error } = await supabase
      .from("Student")
      .update({ halaqaId: null })
      .eq("id", studentId)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(student);
  } catch (e) {
    console.error("Error removing student:", e);
    return NextResponse.json({ error: "Failed to remove student" }, { status: 500 });
  }
}
