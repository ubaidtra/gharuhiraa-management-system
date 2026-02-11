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
    const { data: teacher, error: teacherError } = await supabase
      .from("Teacher")
      .select("firstName, lastName, teacherId")
      .eq("id", id)
      .single();

    if (teacherError || !teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    await supabase
      .from("LearningRecord")
      .delete()
      .eq("teacherId", id);

    await supabase
      .from("Report")
      .delete()
      .eq("teacherId", id);

    await supabase
      .from("Halaqa")
      .delete()
      .eq("teacherId", id);

    const { error: deleteError } = await supabase
      .from("Teacher")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      message: `Teacher ${teacher.firstName} ${teacher.lastName} (${teacher.teacherId}) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}

