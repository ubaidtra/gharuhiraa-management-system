import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const userCount = await prisma.user.count();
    
    if (userCount > 0) {
      return NextResponse.json(
        { error: "Signup is disabled. Users already exist in the system." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: "Username, password, and role are required" },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const validRoles = ["MANAGEMENT", "ACCOUNTS", "TEACHER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be MANAGEMENT, ACCOUNTS, or TEACHER" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ 
      signupEnabled: userCount === 0,
      userCount 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check signup status" },
      { status: 500 }
    );
  }
}

