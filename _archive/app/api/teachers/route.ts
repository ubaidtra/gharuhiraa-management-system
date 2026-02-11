import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { generateTeacherId } from "@/lib/idGenerator";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: teachers, error } = await supabase
      .from("Teacher")
      .select(`
        *,
        Halaqa:Halaqa (
          *,
          Student:Student (*)
        )
      `)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    const formattedTeachers = teachers?.map(teacher => ({
      ...teacher,
      halaqas: teacher.Halaqa?.map((h: any) => ({
        ...h,
        students: h.Student || []
      })) || []
    }));

    return NextResponse.json(formattedTeachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
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
    
    const teacherId = await generateTeacherId();
    
    const { data: teacher, error } = await supabase
      .from("Teacher")
      .insert({
        teacherId,
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        certificate: body.certificate,
        dob: body.dob,
        photo: body.photo,
        address: body.address,
        phone: body.phone,
        employmentType: body.employmentType,
        hireDate: body.hireDate || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}

