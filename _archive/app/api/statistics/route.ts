import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "MANAGEMENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get basic counts
    const { count: totalStudents } = await supabase
      .from("Student")
      .select("*", { count: "exact", head: true })
      .eq("isActive", true);

    const { count: totalTeachers } = await supabase
      .from("Teacher")
      .select("*", { count: "exact", head: true })
      .eq("isActive", true);

    const { count: totalHalaqas } = await supabase
      .from("Halaqa")
      .select("*", { count: "exact", head: true })
      .eq("isActive", true);

    // Get financial statistics
    const { data: transactions } = await supabase
      .from("Transaction")
      .select("*");

    const totalRevenue = transactions
      ?.filter((t) => t.type !== "WITHDRAWAL")
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const totalWithdrawals = transactions
      ?.filter((t) => t.type === "WITHDRAWAL")
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // Get learning progress statistics
    const { data: recentRecords } = await supabase
      .from("LearningRecord")
      .select("*")
      .order("weekStartDate", { ascending: false })
      .limit(100);

    const totalMemorizedDays = recentRecords?.reduce(
      (sum, r) => sum + (r.memorizedDays || 0),
      0
    ) || 0;
    const totalMurajaaDays = recentRecords?.reduce(
      (sum, r) => sum + (r.murajaaDays || 0),
      0
    ) || 0;
    const totalRubu = recentRecords?.reduce(
      (sum, r) => sum + Number(r.rubuAmount || 0),
      0
    ) || 0;

    // Get students by Halaqa
    const { data: halaqas } = await supabase
      .from("Halaqa")
      .select(`
        *,
        Teacher (*),
        Student (*)
      `);

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
      halaqas: halaqas?.map((h: any) => ({
        id: h.id,
        name: h.name,
        teacherName: h.Teacher ? `${h.Teacher.firstName} ${h.Teacher.lastName}` : "N/A",
        studentCount: h.Student?.length || 0,
      })) || [],
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

