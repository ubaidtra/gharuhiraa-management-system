import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ACCOUNTS" && session.user.role !== "MANAGEMENT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        firstName: true,
        lastName: true,
        studentId: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Delete related records first (cascade delete)
    await prisma.learningRecord.deleteMany({
      where: { studentId: id },
    });

    await prisma.transaction.deleteMany({
      where: { studentId: id },
    });

    // Delete the student
    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json({
      message: `Student ${student.firstName} ${student.lastName} (${student.studentId}) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}

