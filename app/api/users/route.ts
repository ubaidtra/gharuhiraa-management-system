import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { data, error } = await supabase
      .from("User")
      .select("id, username, role, teacherId, createdAt")
      .order("createdAt", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    console.error("Error fetching users:", e);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
