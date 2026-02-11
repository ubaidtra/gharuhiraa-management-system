import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { generateTeacherId } from "@/lib/idGenerator";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: teachers, error } = await supabase
      .from("Teacher")
      .select(`
        *,
        Halaqa (
          id,
          name,
          Student (id)
        )
      `)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    const formatted = (teachers || []).map((t: { Halaqa?: { id: string; name: string; Student?: { id: string }[] }[] }) => ({
      ...t,
      halaqas: (t.Halaqa || []).map((h) => ({ ...h, students: h.Student || [] })),
    }));
    return NextResponse.json(formatted);
  } catch (e) {
    console.error("Error fetching teachers:", e);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const teacherId = await generateTeacherId();

    const { data: teacher, error } = await supabase
      .from("Teacher")
      .insert({
        teacherId,
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        certificate: body.certificate || null,
        dob: body.dob,
        photo: body.photo || null,
        address: body.address,
        phone: body.phone || null,
        employmentType: body.employmentType,
        hireDate: body.hireDate || new Date().toISOString().slice(0, 10),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(teacher, { status: 201 });
  } catch (e) {
    console.error("Error creating teacher:", e);
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}
