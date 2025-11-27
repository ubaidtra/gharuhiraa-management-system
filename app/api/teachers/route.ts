import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTeacherId } from "@/lib/idGenerator";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teachers = await prisma.teacher.findMany({
      include: {
        halaqas: {
          include: {
            students: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
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
    
    // Generate unique teacher ID
    const teacherId = await generateTeacherId();
    
    const teacher = await prisma.teacher.create({
      data: {
        teacherId,
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        certificate: body.certificate,
        dob: new Date(body.dob),
        photo: body.photo,
        address: body.address,
        phone: body.phone,
        employmentType: body.employmentType,
        hireDate: body.hireDate ? new Date(body.hireDate) : new Date(),
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}

