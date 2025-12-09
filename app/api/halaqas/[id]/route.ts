import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const halaqa = await prisma.halaqa.findUnique({
      where: { id },
      include: {
        teacher: true,
        students: true,
      },
    });

    if (!halaqa) {
      return NextResponse.json({ error: "Halaqa not found" }, { status: 404 });
    }

    return NextResponse.json(halaqa);
  } catch (error) {
    console.error("Error fetching halaqa:", error);
    return NextResponse.json(
      { error: "Failed to fetch halaqa" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // If user is ACCOUNTS, allow full update including teacher assignment
    if (session.user.role === "ACCOUNTS") {
      const halaqa = await prisma.halaqa.update({
        where: { id },
        data: {
          name: body.name,
          studentLevel: body.studentLevel,
          teacherId: body.teacherId,
          isActive: body.isActive,
        },
      });
      return NextResponse.json(halaqa);
    }

    // If user is TEACHER, only allow updating their own halaqa (name and level only)
    if (session.user.role === "TEACHER") {
      // First, check if this halaqa is assigned to this teacher
      const existingHalaqa = await prisma.halaqa.findUnique({
        where: { id },
      });

      if (!existingHalaqa) {
        return NextResponse.json({ error: "Halaqa not found" }, { status: 404 });
      }

      if (existingHalaqa.teacherId !== session.user.id) {
        return NextResponse.json(
          { error: "Unauthorized - You can only edit Halaqas assigned to you" },
          { status: 403 }
        );
      }

      // Teachers can only update name and studentLevel, not teacherId
      const halaqa = await prisma.halaqa.update({
        where: { id },
        data: {
          name: body.name,
          studentLevel: body.studentLevel,
        },
      });
      return NextResponse.json(halaqa);
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  } catch (error) {
    console.error("Error updating halaqa:", error);
    return NextResponse.json(
      { error: "Failed to update halaqa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized - Only Accounts and Admin can delete Halaqas" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.halaqa.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Halaqa deleted successfully" });
  } catch (error) {
    console.error("Error deleting halaqa:", error);
    return NextResponse.json(
      { error: "Failed to delete halaqa" },
      { status: 500 }
    );
  }
}

