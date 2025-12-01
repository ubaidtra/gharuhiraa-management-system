import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only ACCOUNTS can update usernames
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, newUsername } = body;

    // Validation
    if (!userId || !newUsername) {
      return NextResponse.json(
        { error: "User ID and new username are required" },
        { status: 400 }
      );
    }

    // Validate username format
    if (newUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    // Check if username contains only valid characters (letters, numbers, underscore, hyphen)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(newUsername)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, underscores, and hyphens" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if new username is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { username: newUsername },
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Check if username is the same as current
    if (user.username === newUsername) {
      return NextResponse.json(
        { error: "New username must be different from current username" },
        { status: 400 }
      );
    }

    const oldUsername = user.username;

    // Update username
    await prisma.user.update({
      where: { id: userId },
      data: { username: newUsername },
    });

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

