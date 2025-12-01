import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only ACCOUNTS can toggle teacher status
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Toggle the isActive status
    const updatedTeacher = await prisma.teacher.update({
      where: { id: params.id },
      data: { isActive: !teacher.isActive },
    });

    return NextResponse.json({
      message: `Teacher ${updatedTeacher.isActive ? "activated" : "deactivated"} successfully`,
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error("Error toggling teacher status:", error);
    return NextResponse.json(
      { error: "Failed to toggle teacher status" },
      { status: 500 }
    );
  }
}

