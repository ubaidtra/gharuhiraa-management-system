import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAllUsers() {
  console.log("🔐 Creating/updating all users...");

  const users = [
    { username: "management", password: "management123", role: "MANAGEMENT" },
    { username: "accounts", password: "accounts123", role: "ACCOUNTS" },
    { username: "teacher", password: "teacher123", role: "TEACHER" },
  ];

  for (const userData of users) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { username: userData.username },
      });

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      if (existingUser) {
        await prisma.user.update({
          where: { username: userData.username },
          data: {
            password: hashedPassword,
            role: userData.role,
          },
        });
        console.log(`✅ Updated user: ${userData.username} (${userData.role})`);
      } else {
        await prisma.user.create({
          data: {
            username: userData.username,
            password: hashedPassword,
            role: userData.role,
          },
        });
        console.log(`✅ Created user: ${userData.username} (${userData.role})`);
      }

      const verifyUser = await prisma.user.findUnique({
        where: { username: userData.username },
      });

      if (verifyUser) {
        const passwordMatch = await bcrypt.compare(
          userData.password,
          verifyUser.password
        );
        console.log(
          `   Password verification: ${passwordMatch ? "✅ Match" : "❌ No match"}`
        );
      }
    } catch (error) {
      console.error(`❌ Error with user ${userData.username}:`, error);
    }
  }

  console.log("🎉 User creation/update completed!");
}

createAllUsers()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

