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
    const { data: halaqa, error } = await supabase
      .from("Halaqa")
      .select(`
        *,
        Teacher (*),
        Student (*)
      `)
      .eq("id", id)
      .single();

    if (error || !halaqa) return NextResponse.json({ error: "Halaqa not found" }, { status: 404 });
    return NextResponse.json(halaqa);
  } catch (e) {
    console.error("Error fetching halaqa:", e);
    return NextResponse.json({ error: "Failed to fetch halaqa" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    if (session.user.role === "ACCOUNTS") {
      const updateData: Record<string, unknown> = { name: body.name, studentLevel: body.studentLevel };
      if (body.teacherId !== undefined) updateData.teacherId = body.teacherId;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;
      const { data: halaqa, error } = await supabase.from("Halaqa").update(updateData).eq("id", id).select().single();
      if (error) throw error;
      return NextResponse.json(halaqa);
    }

    if (session.user.role === "TEACHER") {
      const { data: existing, error: fe } = await supabase.from("Halaqa").select("teacherId").eq("id", id).single();
      if (fe || !existing) return NextResponse.json({ error: "Halaqa not found" }, { status: 404 });
      if (existing.teacherId !== session.user.teacherId) {
        return NextResponse.json({ error: "You can only edit your assigned halaqas" }, { status: 403 });
      }
      const { data: halaqa, error } = await supabase
        .from("Halaqa")
        .update({ name: body.name, studentLevel: body.studentLevel })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(halaqa);
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  } catch (e) {
    console.error("Error updating halaqa:", e);
    return NextResponse.json({ error: "Failed to update halaqa" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;
    const { error } = await supabase.from("Halaqa").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ message: "Halaqa deleted" });
  } catch (e) {
    console.error("Error deleting halaqa:", e);
    return NextResponse.json({ error: "Failed to delete halaqa" }, { status: 500 });
  }
}
