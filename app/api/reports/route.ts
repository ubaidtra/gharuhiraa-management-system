import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "TEACHER" && session.user.role !== "MANAGEMENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    let query = supabase
      .from("Report")
      .select("*, Teacher(id, teacherId, firstName, lastName)")
      .order("createdAt", { ascending: false });
    if (session.user.role === "TEACHER" && session.user.teacherId) {
      query = query.eq("teacherId", session.user.teacherId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    console.error("Error fetching reports:", e);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
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
    if (!body.title || !body.content || !body.type) {
      return NextResponse.json({ error: "Title, content, and type required" }, { status: 400 });
    }
    if (!["WEEKLY", "MONTHLY"].includes(body.type)) {
      return NextResponse.json({ error: "Type must be WEEKLY or MONTHLY" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("Report")
      .insert({ title: body.title, content: body.content, type: body.type, teacherId })
      .select("*, Teacher(id, teacherId, firstName, lastName)")
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error("Error creating report:", e);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
