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
    const teacherId = searchParams.get("teacherId");

    const halaqas = await prisma.halaqa.findMany({
      where: teacherId ? { teacherId } : undefined,
      include: {
        teacher: true,
        students: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(halaqas);
  } catch (error) {
    console.error("Error fetching halaqas:", error);
    return NextResponse.json(
      { error: "Failed to fetch halaqas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACCOUNTS") {
      return NextResponse.json({ error: "Unauthorized - Only Accounts and Admin can create Halaqas" }, { status: 403 });
    }

    const body = await request.json();
    const halaqa = await prisma.halaqa.create({
      data: {
        name: body.name,
        studentLevel: body.studentLevel,
        teacherId: body.teacherId,
      },
    });

    return NextResponse.json(halaqa, { status: 201 });
  } catch (error) {
    console.error("Error creating halaqa:", error);
    return NextResponse.json(
      { error: "Failed to create halaqa" },
      { status: 500 }
    );
  }
}

