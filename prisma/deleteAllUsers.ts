import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteAllUsers() {
  console.log("⚠️  WARNING: This will delete ALL user accounts!");
  console.log("Starting user deletion process...\n");

  try {
    const usersBefore = await prisma.user.findMany({
      select: { username: true, role: true },
    });

    console.log(`Found ${usersBefore.length} user(s) to delete:`);
    usersBefore.forEach((user) => {
      console.log(`  - ${user.username} (${user.role})`);
    });

    const usersDeleted = await prisma.user.deleteMany({});
    console.log(`\n✓ Deleted ${usersDeleted.count} user(s)`);

    const usersAfter = await prisma.user.count();
    console.log(`\nRemaining users: ${usersAfter}`);

    if (usersAfter === 0) {
      console.log("\n✅ All users deleted successfully!");
      console.log("You can now use the signup page to create a new admin account.");
      console.log("Visit: http://localhost:8001/signup");
    }
  } catch (error) {
    console.error("❌ Error during deletion:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllUsers();

