import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateStudentId, generateTeacherId } from "../lib/idGenerator";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create default users
  const hashedManagementPassword = await bcrypt.hash("management123", 10);
  const hashedAccountsPassword = await bcrypt.hash("accounts123", 10);
  const hashedTeacherPassword = await bcrypt.hash("teacher123", 10);

  const managementUser = await prisma.user.upsert({
    where: { username: "management" },
    update: {},
    create: {
      username: "management",
      password: hashedManagementPassword,
      role: "MANAGEMENT",
    },
  });

  const accountsUser = await prisma.user.upsert({
    where: { username: "accounts" },
    update: {},
    create: {
      username: "accounts",
      password: hashedAccountsPassword,
      role: "ACCOUNTS",
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { username: "teacher" },
    update: {},
    create: {
      username: "teacher",
      password: hashedTeacherPassword,
      role: "TEACHER",
    },
  });

  console.log("✅ Created default users");

  // Create teachers
  const teacher1 = await prisma.teacher.create({
    data: {
      teacherId: await generateTeacherId(),
      firstName: "Ahmad",
      lastName: "Khan",
      gender: "MALE",
      certificate: "Ijazah in Hafs from Asim",
      dob: new Date("1985-05-15"),
      address: "123 Main Street, City",
      phone: "555-0101",
      employmentType: "FULL_TIME",
    },
  });

  const teacher2 = await prisma.teacher.create({
    data: {
      teacherId: await generateTeacherId(),
      firstName: "Fatima",
      lastName: "Ahmed",
      gender: "FEMALE",
      certificate: "Certified Quran Teacher",
      dob: new Date("1990-08-20"),
      address: "456 Oak Avenue, City",
      phone: "555-0102",
      employmentType: "PART_TIME",
    },
  });

  console.log("✅ Created teachers");

  // Create halaqas
  const halaqa1 = await prisma.halaqa.create({
    data: {
      name: "Beginners Group A",
      studentLevel: "Beginner",
      teacherId: teacher1.id,
    },
  });

  const halaqa2 = await prisma.halaqa.create({
    data: {
      name: "Intermediate Group B",
      studentLevel: "Intermediate",
      teacherId: teacher2.id,
    },
  });

  console.log("✅ Created halaqas");

  // Create students
  const student1 = await prisma.student.create({
    data: {
      studentId: await generateStudentId(),
      firstName: "Ali",
      fatherName: "Muhammad",
      lastName: "Hassan",
      dob: new Date("2010-03-15"),
      address: "789 Elm Street, City",
      gender: "MALE",
      phone: "555-1001",
      guardianPhone: "555-1002",
      halaqaId: halaqa1.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      studentId: await generateStudentId(),
      firstName: "Aisha",
      fatherName: "Ibrahim",
      lastName: "Ali",
      dob: new Date("2012-07-22"),
      address: "321 Pine Road, City",
      gender: "FEMALE",
      guardianPhone: "555-2001",
      halaqaId: halaqa1.id,
    },
  });

  const student3 = await prisma.student.create({
    data: {
      studentId: await generateStudentId(),
      firstName: "Omar",
      fatherName: "Abdullah",
      lastName: "Yusuf",
      dob: new Date("2009-11-08"),
      address: "654 Maple Drive, City",
      gender: "MALE",
      phone: "555-3001",
      guardianPhone: "555-3002",
      halaqaId: halaqa2.id,
    },
  });

  const student4 = await prisma.student.create({
    data: {
      studentId: await generateStudentId(),
      firstName: "Zainab",
      fatherName: "Umar",
      lastName: "Malik",
      dob: new Date("2011-04-17"),
      address: "987 Cedar Lane, City",
      gender: "FEMALE",
      guardianPhone: "555-4001",
      halaqaId: halaqa2.id,
    },
  });

  console.log("✅ Created students");

  // Create transactions
  await prisma.transaction.create({
    data: {
      type: "REGISTRATION_FEE",
      amount: 50.0,
      description: "Initial registration fee",
      studentId: student1.id,
    },
  });

  await prisma.transaction.create({
    data: {
      type: "SCHOOL_FEE",
      amount: 100.0,
      description: "Monthly school fee - January",
      studentId: student1.id,
    },
  });

  await prisma.transaction.create({
    data: {
      type: "REGISTRATION_FEE",
      amount: 50.0,
      description: "Initial registration fee",
      studentId: student2.id,
    },
  });

  await prisma.transaction.create({
    data: {
      type: "UNIFORM_FEE",
      amount: 30.0,
      description: "School uniform",
      studentId: student2.id,
    },
  });

  await prisma.transaction.create({
    data: {
      type: "REGISTRATION_FEE",
      amount: 50.0,
      description: "Initial registration fee",
      studentId: student3.id,
    },
  });

  await prisma.transaction.create({
    data: {
      type: "WITHDRAWAL",
      amount: 200.0,
      description: "Office supplies purchase",
    },
  });

  console.log("✅ Created transactions");

  // Create learning records
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  await prisma.learningRecord.create({
    data: {
      studentId: student1.id,
      teacherId: teacher1.id,
      weekStartDate: lastWeek,
      attendance: 6,
      surah: "Al-Baqarah",
      dailyDars: "Ayah 1-10",
      memorizedDays: 5,
      notMemorizedDays: 1,
      rubuAmount: 0.5,
      murajaaFrom: "Al-Fatihah",
      murajaaTo: "Al-Fatihah",
      murajaaDays: 6,
      murajaaNotDays: 0,
      notes: "Good progress this week",
    },
  });

  await prisma.learningRecord.create({
    data: {
      studentId: student2.id,
      teacherId: teacher1.id,
      weekStartDate: lastWeek,
      attendance: 5,
      surah: "Al-Mulk",
      dailyDars: "Ayah 1-5",
      memorizedDays: 4,
      notMemorizedDays: 1,
      rubuAmount: 0.25,
      murajaaFrom: "An-Nas",
      murajaaTo: "Al-Ikhlas",
      murajaaDays: 5,
      murajaaNotDays: 0,
      notes: "Needs more practice",
    },
  });

  await prisma.learningRecord.create({
    data: {
      studentId: student3.id,
      teacherId: teacher2.id,
      weekStartDate: lastWeek,
      attendance: 6,
      surah: "Yasin",
      dailyDars: "Ayah 20-30",
      memorizedDays: 6,
      notMemorizedDays: 0,
      rubuAmount: 0.75,
      murajaaFrom: "Al-Kahf",
      murajaaTo: "Al-Kahf",
      murajaaDays: 6,
      murajaaNotDays: 0,
      notes: "Excellent performance",
    },
  });

  console.log("✅ Created learning records");

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📝 Test Credentials:");
  console.log("  Management: username='management', password='management123'");
  console.log("  Accounts:   username='accounts', password='accounts123'");
  console.log("  Teacher:    username='teacher', password='teacher123'");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

