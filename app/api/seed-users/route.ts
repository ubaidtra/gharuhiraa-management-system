import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
        const existingUser = await prisma.user.findUnique({
          where: { username: userData.username },
        });

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        if (existingUser) {
          await prisma.user.update({
            where: { username: userData.username },
            data: { password: hashedPassword, role: userData.role },
          });
          results.push(`✅ Updated user: ${userData.username}`);
        } else {
          await prisma.user.create({
            data: {
              username: userData.username,
              password: hashedPassword,
              role: userData.role,
            },
          });
          results.push(`✅ Created user: ${userData.username}`);
        }
      } catch (error: any) {
        results.push(`❌ Error with ${userData.username}: ${error.message}`);
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

