import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const studentId = request.nextUrl.searchParams.get("studentId");
    const teacherId = request.nextUrl.searchParams.get("teacherId");
    let query = supabase
      .from("LearningRecord")
      .select("*, Student(*), Teacher(*)")
      .order("weekStartDate", { ascending: false });
    if (studentId) query = query.eq("studentId", studentId);
    if (teacherId) query = query.eq("teacherId", teacherId);
    if (session.user.role === "TEACHER" && session.user.teacherId) {
      query = query.eq("teacherId", session.user.teacherId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    console.error("Error fetching learning records:", e);
    return NextResponse.json({ error: "Failed to fetch learning records" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const teacherId = session.user.teacherId;
    if (!teacherId) return NextResponse.json({ error: "No teacher profile linked" }, { status: 403 });
    const body = await request.json();
    const { data, error } = await supabase
      .from("LearningRecord")
      .insert({
        studentId: body.studentId,
        teacherId,
        weekStartDate: body.weekStartDate,
        attendance: parseInt(body.attendance) || 0,
        surah: body.surah || null,
        dailyDars: body.dailyDars || null,
        memorizedDays: parseInt(body.memorizedDays) || 0,
        notMemorizedDays: parseInt(body.notMemorizedDays) || 0,
        rubuAmount: parseFloat(body.rubuAmount) || 0,
        murajaaFrom: body.murajaaFrom || null,
        murajaaTo: body.murajaaTo || null,
        murajaaDays: parseInt(body.murajaaDays) || 0,
        murajaaNotDays: parseInt(body.murajaaNotDays) || 0,
        notes: body.notes || null,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error("Error creating learning record:", e);
    return NextResponse.json({ error: "Failed to create learning record" }, { status: 500 });
  }
}
