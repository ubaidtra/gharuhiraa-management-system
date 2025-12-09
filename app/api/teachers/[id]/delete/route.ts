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
    const teacher = await prisma.teacher.findUnique({
      where: { id },
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
      where: { teacherId: id },
    });

    await prisma.report.deleteMany({
      where: { teacherId: id },
    });

    // Delete associated halaqas (teacherId is required, cannot be null)
    await prisma.halaqa.deleteMany({
      where: { teacherId: id },
    });

    // Delete the teacher
    await prisma.teacher.delete({
      where: { id },
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

