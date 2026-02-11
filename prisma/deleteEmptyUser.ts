import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteEmptyUser() {
  try {
    const emptyUsers = await prisma.user.findMany({
      where: {
        OR: [
          { username: null },
          { username: "" },
          { password: null },
          { password: "" },
        ],
      },
    });

    if (emptyUsers.length > 0) {
      const result = await prisma.user.deleteMany({
        where: {
          OR: [
            { username: null },
            { username: "" },
            { password: null },
            { password: "" },
          ],
        },
      });
      console.log(`Deleted ${result.count} empty user(s)`);
    } else {
      console.log("No empty users found");
    }

    const allUsers = await prisma.user.findMany({
      select: { id: true, username: true, role: true },
    });
    console.log("\nRemaining users:");
    allUsers.forEach((user) => {
      console.log(`  - ${user.username} (${user.role})`);
    });
  } catch (error) {
    console.error("Error deleting empty user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteEmptyUser();
