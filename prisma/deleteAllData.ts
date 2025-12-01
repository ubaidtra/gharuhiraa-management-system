import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteAllData() {
  console.log("⚠️  WARNING: This will delete ALL students and teachers!");
  console.log("Starting deletion process...\n");

  try {
    // Step 1: Delete all learning records (references students and teachers)
    const learningRecordsDeleted = await prisma.learningRecord.deleteMany({});
    console.log(`✓ Deleted ${learningRecordsDeleted.count} learning records`);

    // Step 2: Delete all transactions (references students)
    const transactionsDeleted = await prisma.transaction.deleteMany({});
    console.log(`✓ Deleted ${transactionsDeleted.count} transactions`);

    // Step 3: Delete all students
    const studentsDeleted = await prisma.student.deleteMany({});
    console.log(`✓ Deleted ${studentsDeleted.count} students`);

    // Step 4: Delete all halaqas (references teachers)
    const halaqasDeleted = await prisma.halaqa.deleteMany({});
    console.log(`✓ Deleted ${halaqasDeleted.count} halaqas`);

    // Step 5: Delete all reports (references teachers)
    const reportsDeleted = await prisma.report.deleteMany({});
    console.log(`✓ Deleted ${reportsDeleted.count} reports`);

    // Step 6: Delete all teachers
    const teachersDeleted = await prisma.teacher.deleteMany({});
    console.log(`✓ Deleted ${teachersDeleted.count} teachers`);

    console.log("\n🎉 All students and teachers deleted successfully!");
    console.log("\nNote: User accounts (management, accounts, teacher) are NOT deleted.");
    console.log("You can now add fresh data to your system.\n");
  } catch (error) {
    console.error("❌ Error during deletion:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllData();

