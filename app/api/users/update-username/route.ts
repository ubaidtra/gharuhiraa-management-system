import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await request.json();
    const { userId, newUsername } = body;
    if (!userId || !newUsername) return NextResponse.json({ error: "userId and newUsername required" }, { status: 400 });
    if (newUsername.length < 3) return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) return NextResponse.json({ error: "Username: letters, numbers, underscore, hyphen only" }, { status: 400 });

    const { data: user, error: ue } = await supabase.from("User").select("id, username").eq("id", userId).single();
    if (ue || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { data: existing } = await supabase.from("User").select("id").eq("username", newUsername).maybeSingle();
    if (existing && existing.id !== userId) return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    if (user.username === newUsername) return NextResponse.json({ error: "New username must differ" }, { status: 400 });

    const { error } = await supabase.from("User").update({ username: newUsername }).eq("id", userId);
    if (error) throw error;
    return NextResponse.json({ message: "Username updated" });
  } catch (e) {
    console.error("Error updating username:", e);
    return NextResponse.json({ error: "Failed to update username" }, { status: 500 });
  }
}
