import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { studentId } = body;

    const student = await prisma.student.update({
      where: { id: studentId },
      data: {
        halaqaId: params.id,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error adding student to halaqa:", error);
    return NextResponse.json(
      { error: "Failed to add student to halaqa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.update({
      where: { id: studentId },
      data: {
        halaqaId: null,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error removing student from halaqa:", error);
    return NextResponse.json(
      { error: "Failed to remove student from halaqa" },
      { status: 500 }
    );
  }
}

