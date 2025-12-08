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
    
    // Only ACCOUNTS can delete teachers
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      select: {
        firstName: true,
        lastName: true,
        teacherId: true,
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Delete related records first
    await prisma.learningRecord.deleteMany({
      where: { teacherId: params.id },
    });

    await prisma.report.deleteMany({
      where: { teacherId: params.id },
    });

    // Remove teacher from halaqas (set teacherId to null)
    await prisma.halaqa.updateMany({
      where: { teacherId: params.id },
      data: { teacherId: null },
    });

    // Delete the teacher
    await prisma.teacher.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: `Teacher ${teacher.firstName} ${teacher.lastName} (${teacher.teacherId}) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}

