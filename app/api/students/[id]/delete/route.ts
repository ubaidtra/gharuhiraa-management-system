import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only ACCOUNTS can delete students
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const student = await prisma.student.findUnique({
      where: { id: params.id },
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
      where: { studentId: params.id },
    });

    await prisma.transaction.deleteMany({
      where: { studentId: params.id },
    });

    // Delete the student
    await prisma.student.delete({
      where: { id: params.id },
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

