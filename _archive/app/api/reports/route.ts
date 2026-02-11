import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET - List reports (Teachers: own reports, Management: all reports)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("Report")
      .select(`
        *,
        Teacher (
          id,
          teacherId,
          firstName,
          lastName
        )
      `)
      .order("createdAt", { ascending: false });

    if (session.user.role === "TEACHER") {
      query = query.eq("teacherId", session.user.id);
    } else if (session.user.role === "MANAGEMENT") {
      // Directors see all reports - no filter needed
    } else {
      return NextResponse.json(
        { error: "Unauthorized - Only Teachers and Directors can view reports" },
        { status: 403 }
      );
    }

    const { data: reports, error } = await query;

    if (error) throw error;

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

// POST - Create new report (Teachers only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Unauthorized - Only Teachers can create reports" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content || !body.type) {
      return NextResponse.json(
        { error: "Title, content, and report type are required" },
        { status: 400 }
      );
    }

    // Validate report type
    if (!["WEEKLY", "MONTHLY"].includes(body.type)) {
      return NextResponse.json(
        { error: "Report type must be WEEKLY or MONTHLY" },
        { status: 400 }
      );
    }

    const { data: report, error } = await supabase
      .from("Report")
      .insert({
        title: body.title,
        content: body.content,
        type: body.type,
        teacherId: session.user.id,
      })
      .select(`
        *,
        Teacher (
          id,
          teacherId,
          firstName,
          lastName
        )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}

