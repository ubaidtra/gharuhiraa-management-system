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

    const { count: totalStudents } = await supabase.from("Student").select("*", { count: "exact", head: true }).eq("isActive", true);
    const { count: totalTeachers } = await supabase.from("Teacher").select("*", { count: "exact", head: true }).eq("isActive", true);
    const { count: totalHalaqas } = await supabase.from("Halaqa").select("*", { count: "exact", head: true }).eq("isActive", true);
    const { data: transactions } = await supabase.from("Transaction").select("*");

    const totalRevenue = (transactions || []).filter((t) => t.type !== "WITHDRAWAL").reduce((s, t) => s + Number(t.amount), 0);
    const totalWithdrawals = (transactions || []).filter((t) => t.type === "WITHDRAWAL").reduce((s, t) => s + Number(t.amount), 0);

    const { data: recentRecords } = await supabase
      .from("LearningRecord")
      .select("*")
      .order("weekStartDate", { ascending: false })
      .limit(100);

    const recs = recentRecords || [];
    const totalMemorizedDays = recs.reduce((s, r) => s + (r.memorizedDays || 0), 0);
    const totalMurajaaDays = recs.reduce((s, r) => s + (r.murajaaDays || 0), 0);
    const totalRubu = recs.reduce((s, r) => s + Number(r.rubuAmount || 0), 0);

    const { data: halaqas } = await supabase.from("Halaqa").select("*, Teacher(*), Student(*)");

    return NextResponse.json({
      overview: {
        totalStudents: totalStudents ?? 0,
        totalTeachers: totalTeachers ?? 0,
        totalHalaqas: totalHalaqas ?? 0,
        totalRevenue,
        totalWithdrawals,
        netBalance: totalRevenue - totalWithdrawals,
      },
      learningProgress: {
        totalMemorizedDays,
        totalMurajaaDays,
        totalRubu,
        averageMemorizedPerWeek: recs.length > 0 ? totalMemorizedDays / recs.length : 0,
      },
      halaqas: (halaqas || []).map((h: { id: string; name: string; Teacher?: { firstName: string; lastName: string }; Student?: unknown[] }) => ({
        id: h.id,
        name: h.name,
        teacherName: h.Teacher ? `${h.Teacher.firstName} ${h.Teacher.lastName}` : "N/A",
        studentCount: (h.Student || []).length,
      })),
    });
  } catch (e) {
    console.error("Error fetching statistics:", e);
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}
