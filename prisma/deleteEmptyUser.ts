import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";

const prisma = new PrismaClient();

async function deleteEmptyUser() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL not found");
    return;
  }

  const client = new MongoClient(databaseUrl);

  try {
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection("User");

    const emptyUsers = await usersCollection.find({
      $or: [
        { username: null },
        { username: "" },
        { password: null },
        { password: "" },
      ],
    }).toArray();

    if (emptyUsers.length > 0) {
      const result = await usersCollection.deleteMany({
        $or: [
          { username: null },
          { username: "" },
          { password: null },
          { password: "" },
        ],
      });
      console.log(`Deleted ${result.deletedCount} empty user(s)`);
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
    await client.close();
    await prisma.$disconnect();
  }
}

deleteEmptyUser();
