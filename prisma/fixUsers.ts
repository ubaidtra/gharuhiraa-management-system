import { MongoClient } from "mongodb";

const DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://traubaid:ubaid281986@cluster0.cevggcp.mongodb.net/ubaitech_portio?retryWrites=true&w=majority";

async function fixUsers() {
  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("ubaitech_portio");
    const collection = db.collection("User");

    const result = await collection.deleteMany({ username: null });
    console.log(`✓ Deleted ${result.deletedCount} users with null username`);

    const allUsers = await collection.find({}).toArray();
    console.log(`\nCurrent users in database: ${allUsers.length}`);
    allUsers.forEach((user: any) => {
      console.log(`  - ${user.username || "null"} (${user.role || "unknown"})`);
    });
  } catch (error) {
    console.error("Error fixing users:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

fixUsers();
