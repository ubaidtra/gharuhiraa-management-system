import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import {
  validateBootstrapRole,
  validatePassword,
  validateUsername,
} from "@/lib/utils/validation";

export async function GET() {
  try {
    const { count } = await supabase.from("User").select("*", { count: "exact", head: true });
    return NextResponse.json({ signupEnabled: (count ?? 0) === 0, userCount: count ?? 0 });
  } catch {
    return NextResponse.json({ signupEnabled: false, userCount: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { count } = await supabase.from("User").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      return NextResponse.json({ error: "Signup is disabled. Users already exist." }, { status: 403 });
    }

    const body = await request.json();
    const { username, password, role } = body;
    if (!username || !password || !role) {
      return NextResponse.json({ error: "Username, password, and role are required" }, { status: 400 });
    }

    const usernameValidation = validateUsername(String(username));
    if (!usernameValidation.valid) {
      return NextResponse.json({ error: usernameValidation.error }, { status: 400 });
    }

    const passwordValidation = validatePassword(String(password));
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.error }, { status: 400 });
    }

    const bootstrapRoleValidation = validateBootstrapRole(String(role));
    if (!bootstrapRoleValidation.valid) {
      return NextResponse.json({ error: bootstrapRoleValidation.error }, { status: 400 });
    }

    const { data: existing } = await supabase.from("User").select("id").eq("username", username).maybeSingle();
    if (existing) return NextResponse.json({ error: "Username already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: user, error } = await supabase
      .from("User")
      .insert({ username, password: hashedPassword, role })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "User created", user: { id: user.id, username: user.username, role: user.role } },
      { status: 201 }
    );
  } catch (e: unknown) {
    console.error("Signup error:", e);
    const err = e as { code?: string; message?: string };
    if (err?.code === "42P01") {
      return NextResponse.json({ error: "Database not set up. Run supabase/schema.sql in Supabase SQL Editor." }, { status: 500 });
    }
    return NextResponse.json({ error: err?.message || "Failed to create user" }, { status: 500 });
  }
}
