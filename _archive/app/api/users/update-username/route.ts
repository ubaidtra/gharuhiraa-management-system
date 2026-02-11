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

    if (!userId || !newUsername) {
      return NextResponse.json(
        { error: "User ID and new username are required" },
        { status: 400 }
      );
    }

    if (newUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(newUsername)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, underscores, and hyphens" },
        { status: 400 }
      );
    }

    const { data: user, error: userError } = await supabase
      .from("User")
      .select("id, username")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: existingUser } = await supabase
      .from("User")
      .select("id")
      .eq("username", newUsername)
      .single();

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    if (user.username === newUsername) {
      return NextResponse.json(
        { error: "New username must be different from current username" },
        { status: 400 }
      );
    }

    const oldUsername = user.username;

    const { error: updateError } = await supabase
      .from("User")
      .update({ username: newUsername })
      .eq("id", userId);

    if (updateError) throw updateError;

    return NextResponse.json({
      message: `Username updated successfully from "${oldUsername}" to "${newUsername}"`,
      oldUsername,
      newUsername,
    });
  } catch (error) {
    console.error("Error updating username:", error);
    return NextResponse.json(
      { error: "Failed to update username" },
      { status: 500 }
    );
  }
}

