import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return handleToggle(ctx);
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return handleToggle(ctx);
}

async function handleToggle(
  ctx: { params: Promise<{ id: string }> }
) {
  const { params } = ctx;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;
    const { data: teacher, error: fe } = await supabase.from("Teacher").select("isActive").eq("id", id).single();
    if (fe || !teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    const { data: updated, error } = await supabase.from("Teacher").update({ isActive: !teacher.isActive }).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json(updated);
  } catch (e) {
    console.error("Error toggling teacher:", e);
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
}
