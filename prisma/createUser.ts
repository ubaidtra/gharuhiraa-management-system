import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createUser() {
  const username = "accounts";
  const password = "accounts123";
  const role = "ACCOUNTS";

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      console.log(`User ${username} already exists`);
      await prisma.user.update({
        where: { username },
        data: { password: hashedPassword },
      });
      console.log(`Password updated for ${username}`);
    } else {
      await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role,
        },
      });
      console.log(`User ${username} created successfully`);
    }
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();


