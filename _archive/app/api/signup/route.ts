import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { count: userCount } = await supabase
      .from("User")
      .select("*", { count: "exact", head: true });
    
    if (userCount && userCount > 0) {
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

    const { data: existingUser, error: checkError } = await supabase
      .from("User")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from("User")
      .insert({
        username,
        password: hashedPassword,
        role,
      })
      .select()
      .single();

    if (error) throw error;

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
    const errorMessage = error?.message || error?.code || "Failed to create user";
    const isDatabaseError = error?.code === "42P01" || error?.message?.includes("does not exist") || error?.message?.includes("relation");
    const isAuthError = error?.message?.includes("Invalid API key") || error?.code === "PGRST301";
    
    if (isDatabaseError) {
      return NextResponse.json(
        { error: "Database table not found. Please run the database schema in Supabase Dashboard → SQL Editor." },
        { status: 500 }
      );
    }
    
    if (isAuthError) {
      return NextResponse.json(
        { error: "Invalid Supabase API key. Please check your .env.local file." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to create user: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { count: userCount } = await supabase
      .from("User")
      .select("*", { count: "exact", head: true });
    
    return NextResponse.json({ 
      signupEnabled: (userCount || 0) === 0,
      userCount: userCount || 0
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check signup status" },
      { status: 500 }
    );
  }
}

