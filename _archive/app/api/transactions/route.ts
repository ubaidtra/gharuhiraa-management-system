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

    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");
    const type = searchParams.get("type");

    let query = supabase
      .from("Transaction")
      .select(`
        *,
        Student (*)
      `)
      .order("date", { ascending: false });

    if (studentId) {
      query = query.eq("studentId", studentId);
    }
    if (type) {
      query = query.eq("type", type);
    }

    const { data: transactions, error } = await query;

    if (error) throw error;

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { data: transaction, error } = await supabase
      .from("Transaction")
      .insert({
        type: body.type,
        amount: parseFloat(body.amount),
        description: body.description,
        date: body.date || new Date().toISOString(),
        photoUrl: body.photoUrl,
        studentId: body.studentId || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

