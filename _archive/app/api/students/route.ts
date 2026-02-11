import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { generateStudentId } from "@/lib/idGenerator";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const halaqaId = searchParams.get("halaqaId");

    let query = supabase
      .from("Student")
      .select(`
        *,
        Halaqa (
          *,
          Teacher (*)
        )
      `)
      .order("createdAt", { ascending: false });

    if (halaqaId) {
      query = query.eq("halaqaId", halaqaId);
    }

    const { data: students, error } = await query;

    if (error) throw error;

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    
    const studentId = await generateStudentId();
    
    const { data: student, error } = await supabase
      .from("Student")
      .insert({
        studentId,
        firstName: body.firstName,
        fatherName: body.fatherName,
        lastName: body.lastName,
        dob: body.dob,
        address: body.address,
        gender: body.gender,
        phone: body.phone,
        guardianPhone: body.guardianPhone,
        photo: body.photo,
        halaqaId: body.halaqaId || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

