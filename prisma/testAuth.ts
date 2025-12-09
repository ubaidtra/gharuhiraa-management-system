import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log("Testing database connection...");
    const user = await prisma.user.findUnique({
      where: { username: "accounts" },
    });

    if (!user) {
      console.log("User not found!");
      return;
    }

    console.log("User found:", user.username);
    console.log("Testing password comparison...");
    const isValid = await bcrypt.compare("accounts123", user.password);
    console.log("Password valid:", isValid);

    if (isValid) {
      console.log("✅ Authentication should work!");
    } else {
      console.log("❌ Password doesn't match!");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();

