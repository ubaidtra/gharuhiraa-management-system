import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const users = [
      { username: "management", password: "management123", role: "MANAGEMENT" },
      { username: "accounts", password: "accounts123", role: "ACCOUNTS" },
      { username: "teacher", password: "teacher123", role: "TEACHER" },
    ];

    const results = [];

    for (const userData of users) {
      try {
        const { data: existingUser } = await supabase
          .from("User")
          .select("id")
          .eq("username", userData.username)
          .maybeSingle();

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        if (existingUser) {
          const { error } = await supabase
            .from("User")
            .update({ password: hashedPassword, role: userData.role })
            .eq("id", existingUser.id);

          if (error) throw error;
          results.push(`Updated user: ${userData.username}`);
        } else {
          const { error } = await supabase
            .from("User")
            .insert({
              username: userData.username,
              password: hashedPassword,
              role: userData.role,
            });

          if (error) throw error;
          results.push(`Created user: ${userData.username}`);
        }
      } catch (error: any) {
        results.push(`Error with ${userData.username}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Users seeded successfully",
      results,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed users" },
      { status: 500 }
    );
  }
}






