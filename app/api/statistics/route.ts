import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "MANAGEMENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get basic counts
    const totalStudents = await prisma.student.count({ where: { isActive: true } });
    const totalTeachers = await prisma.teacher.count({ where: { isActive: true } });
    const totalHalaqas = await prisma.halaqa.count({ where: { isActive: true } });

    // Get financial statistics
    const transactions = await prisma.transaction.findMany();
    const totalRevenue = transactions
      .filter((t) => t.type !== "WITHDRAWAL")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = transactions
      .filter((t) => t.type === "WITHDRAWAL")
      .reduce((sum, t) => sum + t.amount, 0);

    // Get learning progress statistics
    const recentRecords = await prisma.learningRecord.findMany({
      orderBy: { weekStartDate: "desc" },
      take: 100,
    });

    const totalMemorizedDays = recentRecords.reduce(
      (sum, r) => sum + r.memorizedDays,
      0
    );
    const totalMurajaaDays = recentRecords.reduce(
      (sum, r) => sum + r.murajaaDays,
      0
    );
    const totalRubu = recentRecords.reduce((sum, r) => sum + r.rubuAmount, 0);

    // Get students by Halaqa
    const halaqas = await prisma.halaqa.findMany({
      include: {
        _count: {
          select: { students: true },
        },
        teacher: true,
      },
    });

    return NextResponse.json({
      overview: {
        totalStudents,
        totalTeachers,
        totalHalaqas,
        totalRevenue,
        totalWithdrawals,
        netBalance: totalRevenue - totalWithdrawals,
      },
      learningProgress: {
        totalMemorizedDays,
        totalMurajaaDays,
        totalRubu,
        averageMemorizedPerWeek:
          recentRecords.length > 0
            ? totalMemorizedDays / recentRecords.length
            : 0,
      },
      halaqas: halaqas.map((h) => ({
        id: h.id,
        name: h.name,
        teacherName: `${h.teacher.firstName} ${h.teacher.lastName}`,
        studentCount: h._count.students,
      })),
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

