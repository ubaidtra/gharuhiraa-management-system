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
    
    const { data: halaqa, error: halaqaError } = await supabase
      .from("Halaqa")
      .select(`
        *,
        Teacher (*),
        Student (*)
      `)
      .eq("id", id)
      .single();

    if (halaqaError || !halaqa) {
      return NextResponse.json({ error: "Halaqa not found" }, { status: 404 });
    }

    return NextResponse.json(halaqa);
  } catch (error) {
    console.error("Error fetching halaqa:", error);
    return NextResponse.json(
      { error: "Failed to fetch halaqa" },
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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // If user is ACCOUNTS, allow full update including teacher assignment
    if (session.user.role === "ACCOUNTS") {
      const { data: halaqa, error } = await supabase
        .from("Halaqa")
        .update({
          name: body.name,
          studentLevel: body.studentLevel,
          teacherId: body.teacherId,
          isActive: body.isActive,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(halaqa);
    }

    // If user is TEACHER, only allow updating their own halaqa (name and level only)
    if (session.user.role === "TEACHER") {
      const { data: existingHalaqa, error: fetchError } = await supabase
        .from("Halaqa")
        .select("teacherId")
        .eq("id", id)
        .single();

      if (fetchError || !existingHalaqa) {
        return NextResponse.json({ error: "Halaqa not found" }, { status: 404 });
      }

      if (existingHalaqa.teacherId !== session.user.id) {
        return NextResponse.json(
          { error: "Unauthorized - You can only edit Halaqas assigned to you" },
          { status: 403 }
        );
      }

      const { data: halaqa, error } = await supabase
        .from("Halaqa")
        .update({
          name: body.name,
          studentLevel: body.studentLevel,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(halaqa);
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  } catch (error) {
    console.error("Error updating halaqa:", error);
    return NextResponse.json(
      { error: "Failed to update halaqa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized - Only Accounts and Admin can delete Halaqas" }, { status: 403 });
    }

    const { id } = await params;
    
    const { error } = await supabase
      .from("Halaqa")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Halaqa deleted successfully" });
  } catch (error) {
    console.error("Error deleting halaqa:", error);
    return NextResponse.json(
      { error: "Failed to delete halaqa" },
      { status: 500 }
    );
  }
}

