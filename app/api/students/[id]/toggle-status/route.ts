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
    
    // Only ACCOUNTS can toggle student status
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const student = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Toggle the isActive status
    const updatedStudent = await prisma.student.update({
      where: { id: params.id },
      data: { isActive: !student.isActive },
    });

    return NextResponse.json({
      message: `Student ${updatedStudent.isActive ? "activated" : "deactivated"} successfully`,
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error toggling student status:", error);
    return NextResponse.json(
      { error: "Failed to toggle student status" },
      { status: 500 }
    );
  }
}

