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

    const { id } = await params;
    const { data: student, error } = await supabase
      .from("Student")
      .select(`
        *,
        Halaqa (
          id,
          name,
          Teacher (id, firstName, lastName)
        )
      `)
      .eq("id", id)
      .single();

    if (error || !student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

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
  } catch (e) {
    console.error("Error fetching student:", e);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
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
    const updateData: Record<string, unknown> = {};
    const fields = ["firstName", "fatherName", "lastName", "dob", "address", "gender", "phone", "guardianPhone", "photo", "isActive", "halaqaId"];
    for (const f of fields) if (body[f] !== undefined) updateData[f] = body[f];

    const { data: student, error } = await supabase
      .from("Student")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(student);
  } catch (e) {
    console.error("Error updating student:", e);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}
