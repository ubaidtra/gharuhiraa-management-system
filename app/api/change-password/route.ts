import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (newPassword !== confirmPassword) return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    if (newPassword.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    if (currentPassword === newPassword) return NextResponse.json({ error: "New password must differ from current" }, { status: 400 });

    const { data: user, error: ue } = await supabase.from("User").select("id, password").eq("id", session.user.id).single();
    if (ue || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    const { error: upErr } = await supabase.from("User").update({ password: hashed }).eq("id", session.user.id);
    if (upErr) throw upErr;
    return NextResponse.json({ message: "Password changed successfully" });
  } catch (e) {
    console.error("Error changing password:", e);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
