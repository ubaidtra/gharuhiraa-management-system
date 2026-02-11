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
    
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { data: student, error: studentError } = await supabase
      .from("Student")
      .select("*")
      .eq("id", id)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const { data: updatedStudent, error: updateError } = await supabase
      .from("Student")
      .update({ isActive: !student.isActive })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      message: `Student ${updatedStudent.isActive ? "activated" : "deactivated"} successfully`,
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error toggling student status:", error);
    return NextResponse.json(
      { error: "Failed to toggle student status" },
      { status: 500 }
    );
  }
}

