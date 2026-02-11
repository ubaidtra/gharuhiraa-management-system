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

    const { id } = await params;
    const body = await request.json();
    const { studentId } = body;

    const { data: student, error } = await supabase
      .from("Student")
      .update({ halaqaId: id })
      .eq("id", studentId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error adding student to halaqa:", error);
    return NextResponse.json(
      { error: "Failed to add student to halaqa" },
      { status: 500 }
    );
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

    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const { data: student, error } = await supabase
      .from("Student")
      .update({ halaqaId: null })
      .eq("id", studentId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error removing student from halaqa:", error);
    return NextResponse.json(
      { error: "Failed to remove student from halaqa" },
      { status: 500 }
    );
  }
}

