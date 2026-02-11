import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await request.json();
    const { userId, newPassword } = body;
    if (!userId || !newPassword) return NextResponse.json({ error: "userId and newPassword required" }, { status: 400 });
    if (newPassword.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const { data: user, error: ue } = await supabase.from("User").select("id, username").eq("id", userId).single();
    if (ue || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const hashed = await bcrypt.hash(newPassword, 10);
    const { error } = await supabase.from("User").update({ password: hashed }).eq("id", userId);
    if (error) throw error;
    return NextResponse.json({ message: `Password reset for ${user.username}` });
  } catch (e) {
    console.error("Error resetting password:", e);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
