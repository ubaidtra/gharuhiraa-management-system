import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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
    end.setHours(23, 59, 59, 999);

    let query = supabase
      .from("Transaction")
      .select(`
        *,
        Student (
          studentId,
          firstName,
          fatherName,
          lastName,
          Halaqa (
            id,
            name
          )
        )
      `)
      .gte("date", start.toISOString())
      .lte("date", end.toISOString())
      .order("date", { ascending: true });

    if (transactionTypes) {
      const typesArray = transactionTypes.split(",").filter(Boolean);
      if (typesArray.length > 0) {
        query = query.in("type", typesArray);
      }
    }

    if (studentIds) {
      const studentsArray = studentIds.split(",").filter(Boolean);
      if (studentsArray.length > 0) {
        query = query.in("studentId", studentsArray);
      }
    }

    const { data: transactions, error: transactionsError } = await query;
    if (transactionsError) throw transactionsError;

    let filteredTransactions = transactions || [];

    if (halaqaIds) {
      const halaqasArray = halaqaIds.split(",").filter(Boolean);
      if (halaqasArray.length > 0) {
        filteredTransactions = filteredTransactions.filter((t: any) => 
          t.Student?.Halaqa && halaqasArray.includes(t.Student.Halaqa.id)
        );
      }
    }

    // Separate revenue and expenses
    const revenueTransactions = filteredTransactions.filter(
      (t: any) => t.type !== "WITHDRAWAL"
    );
    const expenseTransactions = includeWithdrawals
      ? filteredTransactions.filter((t: any) => t.type === "WITHDRAWAL")
      : [];

    // Calculate totals
    const totalRevenue = revenueTransactions.reduce(
      (sum: number, t: any) => sum + Number(t.amount),
      0
    );
    const totalExpenses = expenseTransactions.reduce(
      (sum: number, t: any) => sum + Number(t.amount),
      0
    );
    const netBalance = totalRevenue - totalExpenses;

    // Group revenue by type
    const revenueByType: { [key: string]: { count: number; amount: number } } =
      {};
    revenueTransactions.forEach((t: any) => {
      if (!revenueByType[t.type]) {
        revenueByType[t.type] = { count: 0, amount: 0 };
      }
      revenueByType[t.type].count += 1;
      revenueByType[t.type].amount += Number(t.amount);
    });

    // Get student and teacher counts
    const { count: activeStudents } = await supabase
      .from("Student")
      .select("*", { count: "exact", head: true })
      .eq("isActive", true);

    const { count: activeTeachers } = await supabase
      .from("Teacher")
      .select("*", { count: "exact", head: true })
      .eq("isActive", true);

    const { count: totalHalaqas } = await supabase
      .from("Halaqa")
      .select("*", { count: "exact", head: true })
      .eq("isActive", true);

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
        totalTransactionCount: filteredTransactions.length,
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

