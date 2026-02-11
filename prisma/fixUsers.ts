import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixUsers() {
  try {
    console.log("Connected to database");

    const result = await prisma.user.deleteMany({ 
      where: { username: null } 
    });
    console.log(`✓ Deleted ${result.count} users with null username`);

    const allUsers = await prisma.user.findMany({
      select: { id: true, username: true, role: true },
    });
    console.log(`\nCurrent users in database: ${allUsers.length}`);
    allUsers.forEach((user) => {
      console.log(`  - ${user.username || "null"} (${user.role || "unknown"})`);
    });
  } catch (error) {
    console.error("Error fixing users:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixUsers();
