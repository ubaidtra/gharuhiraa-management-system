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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    const { data: student, error: studentError } = await supabase
      .from("Student")
      .select(`
        *,
        Halaqa (
          *,
          Teacher (*)
        )
      `)
      .eq("id", id)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const { data: learningRecords } = await supabase
      .from("LearningRecord")
      .select("*")
      .eq("studentId", id)
      .order("weekStartDate", { ascending: false })
      .limit(10);

    const { data: transactions } = await supabase
      .from("Transaction")
      .select("*")
      .eq("studentId", id)
      .order("date", { ascending: false });

    return NextResponse.json({
      ...student,
      learningRecords: learningRecords || [],
      transactions: transactions || [],
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const updateData: any = {};
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.fatherName !== undefined) updateData.fatherName = body.fatherName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.dob !== undefined) updateData.dob = body.dob;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.guardianPhone !== undefined) updateData.guardianPhone = body.guardianPhone;
    if (body.photo !== undefined) updateData.photo = body.photo;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.halaqaId !== undefined) updateData.halaqaId = body.halaqaId;

    const { data: student, error } = await supabase
      .from("Student")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
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
    if (!session || (session.user.role !== "ACCOUNTS" && session.user.role !== "MANAGEMENT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { error } = await supabase
      .from("Student")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}

