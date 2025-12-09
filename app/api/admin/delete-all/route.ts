import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "MANAGEMENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const learningRecordsDeleted = await prisma.learningRecord.deleteMany({});
    const transactionsDeleted = await prisma.transaction.deleteMany({});
    const studentsDeleted = await prisma.student.deleteMany({});
    const halaqasDeleted = await prisma.halaqa.deleteMany({});
    const reportsDeleted = await prisma.report.deleteMany({});
    const teachersDeleted = await prisma.teacher.deleteMany({});

    return NextResponse.json({
      message: "All students and teachers deleted successfully",
      deleted: {
        learningRecords: learningRecordsDeleted.count,
        transactions: transactionsDeleted.count,
        students: studentsDeleted.count,
        halaqas: halaqasDeleted.count,
        reports: reportsDeleted.count,
        teachers: teachersDeleted.count,
      },
    });
  } catch (error) {
    console.error("Error deleting all data:", error);
    return NextResponse.json(
      { error: "Failed to delete all data" },
      { status: 500 }
    );
  }
}

