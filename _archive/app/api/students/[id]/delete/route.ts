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
    const { data: student, error: studentError } = await supabase
      .from("Student")
      .select("firstName, lastName, studentId")
      .eq("id", id)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await supabase
      .from("LearningRecord")
      .delete()
      .eq("studentId", id);

    await supabase
      .from("Transaction")
      .delete()
      .eq("studentId", id);

    const { error: deleteError } = await supabase
      .from("Student")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      message: `Student ${student.firstName} ${student.lastName} (${student.studentId}) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}

