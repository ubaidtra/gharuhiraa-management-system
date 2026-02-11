import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "MANAGEMENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [
      { count: learningRecordsCount },
      { count: transactionsCount },
      { count: studentsCount },
      { count: halaqasCount },
      { count: reportsCount },
      { count: teachersCount },
    ] = await Promise.all([
      supabase.from("LearningRecord").select("*", { count: "exact", head: true }),
      supabase.from("Transaction").select("*", { count: "exact", head: true }),
      supabase.from("Student").select("*", { count: "exact", head: true }),
      supabase.from("Halaqa").select("*", { count: "exact", head: true }),
      supabase.from("Report").select("*", { count: "exact", head: true }),
      supabase.from("Teacher").select("*", { count: "exact", head: true }),
    ]);

    const deletePromises = [
      supabase.from("LearningRecord").delete().gte("createdAt", "1970-01-01"),
      supabase.from("Transaction").delete().gte("createdAt", "1970-01-01"),
      supabase.from("Student").delete().gte("createdAt", "1970-01-01"),
      supabase.from("Halaqa").delete().gte("createdAt", "1970-01-01"),
      supabase.from("Report").delete().gte("createdAt", "1970-01-01"),
      supabase.from("Teacher").delete().gte("createdAt", "1970-01-01"),
    ];

    await Promise.all(deletePromises);

    return NextResponse.json({
      message: "All students and teachers deleted successfully",
      deleted: {
        learningRecords: learningRecordsCount || 0,
        transactions: transactionsCount || 0,
        students: studentsCount || 0,
        halaqas: halaqasCount || 0,
        reports: reportsCount || 0,
        teachers: teachersCount || 0,
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







