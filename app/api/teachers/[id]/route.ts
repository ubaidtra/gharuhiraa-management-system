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
    const { data: teacher, error } = await supabase
      .from("Teacher")
      .select(`
        *,
        Halaqa (id, name, Student (id))
      `)
      .eq("id", id)
      .single();

    if (error || !teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    const formatted = { ...teacher, halaqas: (teacher.Halaqa || []).map((h: { Student?: { id: string }[] }) => ({ ...h, students: h.Student || [] })) };
    return NextResponse.json(formatted);
  } catch (e) {
    console.error("Error fetching teacher:", e);
    return NextResponse.json({ error: "Failed to fetch teacher" }, { status: 500 });
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
    const fields = ["firstName", "lastName", "gender", "certificate", "photo", "address", "phone", "employmentType", "isActive"];
    for (const f of fields) if (body[f] !== undefined) updateData[f] = body[f];
    if (body.dob) updateData.dob = body.dob;

    const { data: teacher, error } = await supabase.from("Teacher").update(updateData).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json(teacher);
  } catch (e) {
    console.error("Error updating teacher:", e);
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
}
