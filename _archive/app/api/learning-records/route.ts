import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");
    const teacherId = searchParams.get("teacherId");

    let query = supabase
      .from("LearningRecord")
      .select(`
        *,
        Student (*),
        Teacher (*)
      `)
      .order("weekStartDate", { ascending: false });

    if (studentId) {
      query = query.eq("studentId", studentId);
    }
    if (teacherId) {
      query = query.eq("teacherId", teacherId);
    }

    const { data: learningRecords, error } = await query;

    if (error) throw error;

    return NextResponse.json(learningRecords);
  } catch (error) {
    console.error("Error fetching learning records:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    
    const { data: learningRecord, error } = await supabase
      .from("LearningRecord")
      .insert({
        studentId: body.studentId,
        teacherId: body.teacherId,
        weekStartDate: body.weekStartDate,
        attendance: parseInt(body.attendance) || 0,
        surah: body.surah,
        dailyDars: body.dailyDars,
        memorizedDays: parseInt(body.memorizedDays) || 0,
        notMemorizedDays: parseInt(body.notMemorizedDays) || 0,
        rubuAmount: parseFloat(body.rubuAmount) || 0,
        murajaaFrom: body.murajaaFrom,
        murajaaTo: body.murajaaTo,
        murajaaDays: parseInt(body.murajaaDays) || 0,
        murajaaNotDays: parseInt(body.murajaaNotDays) || 0,
        notes: body.notes,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(learningRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating learning record:", error);
    return NextResponse.json(
      { error: "Failed to create learning record" },
      { status: 500 }
    );
  }
}

