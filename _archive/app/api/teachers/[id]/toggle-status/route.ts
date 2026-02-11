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
    const { data: teacher, error: teacherError } = await supabase
      .from("Teacher")
      .select("*")
      .eq("id", id)
      .single();

    if (teacherError || !teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const { data: updatedTeacher, error: updateError } = await supabase
      .from("Teacher")
      .update({ isActive: !teacher.isActive })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      message: `Teacher ${updatedTeacher.isActive ? "activated" : "deactivated"} successfully`,
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error("Error toggling teacher status:", error);
    return NextResponse.json(
      { error: "Failed to toggle teacher status" },
      { status: 500 }
    );
  }
}

