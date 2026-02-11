import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ACCOUNTS" && session.user.role !== "MANAGEMENT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const studentId = request.nextUrl.searchParams.get("studentId");
    const type = request.nextUrl.searchParams.get("type");
    let query = supabase
      .from("Transaction")
      .select("*, Student(id, studentId, firstName, lastName)")
      .order("date", { ascending: false });
    if (studentId) query = query.eq("studentId", studentId);
    if (type) query = query.eq("type", type);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    console.error("Error fetching transactions:", e);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await request.json();
    const { data, error } = await supabase
      .from("Transaction")
      .insert({
        type: body.type,
        amount: parseFloat(body.amount),
        description: body.description || null,
        date: body.date || new Date().toISOString(),
        photoUrl: body.photoUrl || null,
        studentId: body.studentId || null,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error("Error creating transaction:", e);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
