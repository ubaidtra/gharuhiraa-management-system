import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List reports (Teachers: own reports, Management: all reports)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let reports;

    if (session.user.role === "TEACHER") {
      // Teachers see only their own reports
      reports = await prisma.report.findMany({
        where: { teacherId: session.user.id },
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
        orderBy: { createdAt: "desc" },
      });
    } else if (session.user.role === "MANAGEMENT") {
      // Directors see all reports
      reports = await prisma.report.findMany({
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
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json(
        { error: "Unauthorized - Only Teachers and Directors can view reports" },
        { status: 403 }
      );
    }

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

// POST - Create new report (Teachers only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Unauthorized - Only Teachers can create reports" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content || !body.reportType) {
      return NextResponse.json(
        { error: "Title, content, and report type are required" },
        { status: 400 }
      );
    }

    // Validate report type
    if (!["WEEKLY", "MONTHLY"].includes(body.reportType)) {
      return NextResponse.json(
        { error: "Report type must be WEEKLY or MONTHLY" },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        title: body.title,
        content: body.content,
        reportType: body.reportType,
        teacherId: session.user.id,
      },
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

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}

