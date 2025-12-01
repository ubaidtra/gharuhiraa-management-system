import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "MANAGEMENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("type"); // WEEKLY, MONTHLY, YEARLY
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    
    // Optional filters
    const transactionTypes = searchParams.get("transactionTypes"); // Comma-separated
    const studentIds = searchParams.get("studentIds"); // Comma-separated
    const halaqaIds = searchParams.get("halaqaIds"); // Comma-separated
    const includeWithdrawals = searchParams.get("includeWithdrawals") === "true";

    if (!reportType || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters: type, startDate, endDate" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include entire end date

    // Build where clause with filters
    const whereClause: any = {
      date: {
        gte: start,
        lte: end,
      },
    };

    // Filter by transaction types
    if (transactionTypes) {
      const typesArray = transactionTypes.split(",").filter(Boolean);
      if (typesArray.length > 0) {
        whereClause.type = { in: typesArray };
      }
    }

    // Filter by student IDs
    if (studentIds) {
      const studentsArray = studentIds.split(",").filter(Boolean);
      if (studentsArray.length > 0) {
        whereClause.studentId = { in: studentsArray };
      }
    }

    // Filter by halaqa IDs (via student)
    if (halaqaIds) {
      const halaqasArray = halaqaIds.split(",").filter(Boolean);
      if (halaqasArray.length > 0) {
        whereClause.student = {
          halaqaId: { in: halaqasArray },
        };
      }
    }

    // Fetch all transactions within the date range with filters
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            studentId: true,
            firstName: true,
            fatherName: true,
            lastName: true,
            halaqa: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Separate revenue and expenses
    const revenueTransactions = transactions.filter(
      (t) => t.type !== "WITHDRAWAL"
    );
    const expenseTransactions = includeWithdrawals
      ? transactions.filter((t) => t.type === "WITHDRAWAL")
      : [];

    // Calculate totals
    const totalRevenue = revenueTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const netBalance = totalRevenue - totalExpenses;

    // Group revenue by type
    const revenueByType: { [key: string]: { count: number; amount: number } } =
      {};
    revenueTransactions.forEach((t) => {
      if (!revenueByType[t.type]) {
        revenueByType[t.type] = { count: 0, amount: 0 };
      }
      revenueByType[t.type].count += 1;
      revenueByType[t.type].amount += t.amount;
    });

    // Get student and teacher counts
    const activeStudents = await prisma.student.count({
      where: { isActive: true },
    });
    const activeTeachers = await prisma.teacher.count({
      where: { isActive: true },
    });
    const totalHalaqas = await prisma.halaqa.count({
      where: { isActive: true },
    });

    const report = {
      reportType,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      generatedAt: new Date().toISOString(),
      filters: {
        transactionTypes: transactionTypes?.split(",").filter(Boolean) || [],
        studentIds: studentIds?.split(",").filter(Boolean) || [],
        halaqaIds: halaqaIds?.split(",").filter(Boolean) || [],
        includeWithdrawals,
      },
      summary: {
        totalRevenue,
        totalExpenses,
        netBalance,
        revenueTransactionCount: revenueTransactions.length,
        expenseTransactionCount: expenseTransactions.length,
        totalTransactionCount: transactions.length,
      },
      revenueByType,
      schoolStats: {
        activeStudents,
        activeTeachers,
        totalHalaqas,
      },
      transactions: {
        revenue: revenueTransactions,
        expenses: expenseTransactions,
      },
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating financial report:", error);
    return NextResponse.json(
      { error: "Failed to generate financial report" },
      { status: 500 }
    );
  }
}

