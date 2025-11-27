import { PrismaClient } from "@prisma/client";
import { generateStudentId, generateTeacherId } from "../lib/idGenerator";

const prisma = new PrismaClient();

async function updateExistingRecords() {
  console.log("Updating existing students and teachers with IDs...");

  // Update students - find all and check for missing studentId
  const allStudents = await prisma.student.findMany();
  const studentsWithoutId = allStudents.filter((s: any) => !s.studentId);

  console.log(`Found ${studentsWithoutId.length} students without IDs`);

  for (const student of studentsWithoutId) {
    const studentId = await generateStudentId();
    await prisma.student.update({
      where: { id: student.id },
      data: { studentId },
    });
    console.log(`Updated student ${student.firstName} with ID: ${studentId}`);
  }

  // Update teachers - find all and check for missing teacherId
  const allTeachers = await prisma.teacher.findMany();
  const teachersWithoutId = allTeachers.filter((t: any) => !t.teacherId);

  console.log(`Found ${teachersWithoutId.length} teachers without IDs`);

  for (const teacher of teachersWithoutId) {
    const teacherId = await generateTeacherId();
    await prisma.teacher.update({
      where: { id: teacher.id },
      data: { teacherId },
    });
    console.log(`Updated teacher ${teacher.firstName} with ID: ${teacherId}`);
  }

  console.log("All records updated successfully!");
}

updateExistingRecords()
  .catch((error) => {
    console.error("Error updating records:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

