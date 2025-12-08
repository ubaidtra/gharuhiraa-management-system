import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");
    const teacherId = searchParams.get("teacherId");

    const learningRecords = await prisma.learningRecord.findMany({
      where: {
        ...(studentId ? { studentId } : {}),
        ...(teacherId ? { teacherId } : {}),
      },
      include: {
        student: true,
        teacher: true,
      },
      orderBy: { weekStartDate: "desc" },
    });

    return NextResponse.json(learningRecords);
  } catch (error) {
    console.error("Error fetching learning records:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const learningRecord = await prisma.learningRecord.create({
      data: {
        studentId: body.studentId,
        teacherId: body.teacherId,
        weekStartDate: new Date(body.weekStartDate),
        attendance: parseInt(body.attendance) || 0,
        surah: body.surah,
        dailyDars: body.dailyDars,
        memorizedDays: parseInt(body.memorizedDays) || 0,
        notMemorizedDays: parseInt(body.notMemorizedDays) || 0,
        rubuAmount: parseFloat(body.rubuAmount) || 0,
        murajaaFrom: body.murajaaFrom,
        murajaaTo: body.murajaaTo,
        murajaaDays: parseInt(body.murajaaDays) || 0,
        murajaaNotDays: parseInt(body.murajaaNotDays) || 0,
        notes: body.notes,
      },
    });

    return NextResponse.json(learningRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating learning record:", error);
    return NextResponse.json(
      { error: "Failed to create learning record" },
      { status: 500 }
    );
  }
}

