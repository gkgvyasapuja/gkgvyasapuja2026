import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const sql = neon(process.env.DB_URI!);

async function main() {
  try {
    console.log(
      "Dropping tables with incorrect id types to let drizzle recreate them...",
    );
    await sql`DROP TABLE IF EXISTS "offering" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "book" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "temple" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "city" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "state" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "country" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "user" CASCADE;`;

    console.log("Done dropping tables!");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
