import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import {
  validatePassword,
  validateRole,
  validateTeacherLink,
  validateUsername,
} from "@/lib/utils/validation";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { data, error } = await supabase
      .from("User")
      .select("id, username, role, teacherId, createdAt, Teacher(id, teacherId, firstName, lastName, isActive)")
      .order("createdAt", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    console.error("Error fetching users:", e);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const role = String(body.role || "");
    const teacherId = body.teacherId ? String(body.teacherId) : null;

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return NextResponse.json({ error: usernameValidation.error }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.error }, { status: 400 });
    }

    const roleValidation = validateRole(role);
    if (!roleValidation.valid) {
      return NextResponse.json({ error: roleValidation.error }, { status: 400 });
    }

    const teacherLinkValidation = validateTeacherLink(role, teacherId);
    if (!teacherLinkValidation.valid) {
      return NextResponse.json({ error: teacherLinkValidation.error }, { status: 400 });
    }

    const { data: existingUser } = await supabase.from("User").select("id").eq("username", username).maybeSingle();
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    if (teacherId) {
      const { data: teacher } = await supabase.from("Teacher").select("id").eq("id", teacherId).single();
      if (!teacher) {
        return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
      }

      const { data: linkedUser } = await supabase.from("User").select("id").eq("teacherId", teacherId).maybeSingle();
      if (linkedUser) {
        return NextResponse.json({ error: "Teacher profile is already linked to another user" }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("User")
      .insert({
        username,
        password: hashedPassword,
        role,
        teacherId: role === "TEACHER" ? teacherId : null,
      })
      .select("id, username, role, teacherId, createdAt, Teacher(id, teacherId, firstName, lastName, isActive)")
      .single();
    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error("Error creating user:", e);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const userId = String(body.userId || "");
    const teacherId = body.teacherId ? String(body.teacherId) : null;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const { data: user, error: userError } = await supabase
      .from("User")
      .select("id, username, role, teacherId")
      .eq("id", userId)
      .single();
    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "TEACHER") {
      return NextResponse.json({ error: "Only teacher users can be linked to teacher profiles" }, { status: 400 });
    }

    if (teacherId) {
      const { data: teacher } = await supabase.from("Teacher").select("id").eq("id", teacherId).single();
      if (!teacher) {
        return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
      }

      const { data: linkedUser } = await supabase
        .from("User")
        .select("id")
        .eq("teacherId", teacherId)
        .neq("id", userId)
        .maybeSingle();
      if (linkedUser) {
        return NextResponse.json({ error: "Teacher profile is already linked to another user" }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from("User")
      .update({ teacherId })
      .eq("id", userId)
      .select("id, username, role, teacherId, createdAt, Teacher(id, teacherId, firstName, lastName, isActive)")
      .single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error("Error updating user:", e);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
