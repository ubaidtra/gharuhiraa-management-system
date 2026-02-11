import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const teacherId = request.nextUrl.searchParams.get("teacherId");
    let query = supabase
      .from("Halaqa")
      .select(`
        *,
        Teacher (id, teacherId, firstName, lastName),
        Student (id, studentId, firstName, lastName)
      `)
      .order("createdAt", { ascending: false });

    if (teacherId) query = query.eq("teacherId", teacherId);
    if (session.user.role === "TEACHER" && session.user.teacherId) {
      query = query.eq("teacherId", session.user.teacherId);
    }

    const { data: halaqas, error } = await query;
    if (error) throw error;
    return NextResponse.json(halaqas || []);
  } catch (e) {
    console.error("Error fetching halaqas:", e);
    return NextResponse.json({ error: "Failed to fetch halaqas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await request.json();
    const { data: halaqa, error } = await supabase
      .from("Halaqa")
      .insert({
        name: body.name,
        studentLevel: body.studentLevel || null,
        teacherId: body.teacherId,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(halaqa, { status: 201 });
  } catch (e) {
    console.error("Error creating halaqa:", e);
    return NextResponse.json({ error: "Failed to create halaqa" }, { status: 500 });
  }
}
