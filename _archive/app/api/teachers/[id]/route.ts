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
    
    const { data: teacher, error: teacherError } = await supabase
      .from("Teacher")
      .select(`
        *,
        Halaqa:Halaqa (
          *,
          Student:Student (*)
        )
      `)
      .eq("id", id)
      .single();

    if (teacherError || !teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const formattedTeacher = {
      ...teacher,
      halaqas: teacher.Halaqa?.map((h: any) => ({
        ...h,
        students: h.Student || []
      })) || []
    };

    return NextResponse.json(formattedTeacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return NextResponse.json(
      { error: "Failed to fetch teacher" },
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
    
    const updateData: any = {
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      certificate: body.certificate,
      photo: body.photo,
      address: body.address,
      phone: body.phone,
      employmentType: body.employmentType,
      isActive: body.isActive,
    };

    if (body.dob) {
      updateData.dob = body.dob;
    }

    const { data: teacher, error } = await supabase
      .from("Teacher")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    );
  }
}

