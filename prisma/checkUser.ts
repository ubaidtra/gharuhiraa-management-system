import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { username: "accounts" },
    });

    console.log("User exists:", !!user);
    if (user) {
      console.log("Username:", user.username);
      console.log("Role:", user.role);
      const test = await bcrypt.compare("accounts123", user.password);
      console.log("Password match:", test);
      if (!test) {
        console.log("Password doesn't match. Updating password...");
        const hashedPassword = await bcrypt.hash("accounts123", 10);
        await prisma.user.update({
          where: { username: "accounts" },
          data: { password: hashedPassword },
        });
        console.log("Password updated!");
      }
    } else {
      console.log("User not found. Creating user...");
      const hashedPassword = await bcrypt.hash("accounts123", 10);
      await prisma.user.create({
        data: {
          username: "accounts",
          password: hashedPassword,
          role: "ACCOUNTS",
        },
      });
      console.log("User created!");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();


