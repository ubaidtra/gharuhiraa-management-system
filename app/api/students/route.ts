import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStudentId } from "@/lib/idGenerator";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const halaqaId = searchParams.get("halaqaId");

    const students = await prisma.student.findMany({
      where: halaqaId ? { halaqaId } : undefined,
      include: {
        halaqa: {
          include: {
            teacher: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
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
    
    // Validate required fields
    if (!body.firstName || !body.fatherName || !body.lastName || !body.dob || !body.address || !body.gender) {
      return NextResponse.json(
        { error: "First name, father name, last name, date of birth, address, and gender are required" },
        { status: 400 }
      );
    }
    
    // Generate unique student ID
    const studentId = await generateStudentId();
    
    const student = await prisma.student.create({
      data: {
        studentId,
        firstName: body.firstName.trim(),
        fatherName: body.fatherName.trim(),
        lastName: body.lastName.trim(),
        dob: new Date(body.dob),
        address: body.address.trim(),
        gender: body.gender,
        phone: body.phone?.trim() || null,
        guardianPhone: body.guardianPhone?.trim() || null,
        photo: body.photo || null,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

