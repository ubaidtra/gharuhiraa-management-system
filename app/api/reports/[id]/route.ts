import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - View single report
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
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            teacherId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Teachers can only view their own reports
    if (session.user.role === "TEACHER" && report.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized - Not your report" },
        { status: 403 }
      );
    }

    // Directors can view all reports
    if (session.user.role !== "TEACHER" && session.user.role !== "MANAGEMENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Mark as read if Director is viewing
    if (session.user.role === "MANAGEMENT" && !report.isRead) {
      await prisma.report.update({
        where: { id },
        data: { isRead: true },
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

// DELETE - Delete report (Teachers can delete their own)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Unauthorized - Only Teachers can delete their reports" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Teachers can only delete their own reports
    if (report.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized - Not your report" },
        { status: 403 }
      );
    }

    await prisma.report.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}

