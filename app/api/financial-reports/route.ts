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
    const sp = request.nextUrl.searchParams;
    const reportType = sp.get("type");
    const startDate = sp.get("startDate");
    const endDate = sp.get("endDate");
    const transactionTypes = sp.get("transactionTypes");
    const studentIds = sp.get("studentIds");
    const halaqaIds = sp.get("halaqaIds");
    const includeWithdrawals = sp.get("includeWithdrawals") === "true";

    if (!reportType || !startDate || !endDate) {
      return NextResponse.json({ error: "type, startDate, endDate required" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    let query = supabase
      .from("Transaction")
      .select("*, Student(studentId, firstName, fatherName, lastName, Halaqa(id, name))")
      .gte("date", start.toISOString())
      .lte("date", end.toISOString())
      .order("date", { ascending: true });

    if (transactionTypes) {
      const types = transactionTypes.split(",").filter(Boolean);
      if (types.length) query = query.in("type", types);
    }
    if (studentIds) {
      const ids = studentIds.split(",").filter(Boolean);
      if (ids.length) query = query.in("studentId", ids);
    }

    const { data: transactions, error } = await query;
    if (error) throw error;

    let filtered = transactions || [];
    if (halaqaIds) {
      const ids = halaqaIds.split(",").filter(Boolean);
      if (ids.length) filtered = filtered.filter((t: { Student?: { Halaqa?: { id: string } } }) => t.Student?.Halaqa && ids.includes(t.Student.Halaqa.id));
    }

    const revenue = filtered.filter((t: { type: string }) => t.type !== "WITHDRAWAL");
    const expenses = includeWithdrawals ? filtered.filter((t: { type: string }) => t.type === "WITHDRAWAL") : [];
    const totalRevenue = revenue.reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0);
    const totalExpenses = expenses.reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0);

    const revenueByType: Record<string, { count: number; amount: number }> = {};
    revenue.forEach((t: { type: string; amount: number }) => {
      if (!revenueByType[t.type]) revenueByType[t.type] = { count: 0, amount: 0 };
      revenueByType[t.type].count++;
      revenueByType[t.type].amount += Number(t.amount);
    });

    const { count: activeStudents } = await supabase.from("Student").select("*", { count: "exact", head: true }).eq("isActive", true);
    const { count: activeTeachers } = await supabase.from("Teacher").select("*", { count: "exact", head: true }).eq("isActive", true);
    const { count: totalHalaqas } = await supabase.from("Halaqa").select("*", { count: "exact", head: true }).eq("isActive", true);

    return NextResponse.json({
      reportType,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      generatedAt: new Date().toISOString(),
      filters: { transactionTypes: transactionTypes?.split(",").filter(Boolean) || [], studentIds: studentIds?.split(",").filter(Boolean) || [], halaqaIds: halaqaIds?.split(",").filter(Boolean) || [], includeWithdrawals },
      summary: { totalRevenue, totalExpenses, netBalance: totalRevenue - totalExpenses, revenueTransactionCount: revenue.length, expenseTransactionCount: expenses.length, totalTransactionCount: filtered.length },
      revenueByType,
      schoolStats: { activeStudents: activeStudents ?? 0, activeTeachers: activeTeachers ?? 0, totalHalaqas: totalHalaqas ?? 0 },
      transactions: { revenue, expenses },
    });
  } catch (e) {
    console.error("Error generating financial report:", e);
    return NextResponse.json({ error: "Failed to generate financial report" }, { status: 500 });
  }
}
