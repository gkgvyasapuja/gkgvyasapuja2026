import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });

const sql = neon(process.env.DB_URI!);

async function main() {
  try {
    console.log("Dropping table...");
    await sql`DROP TABLE country CASCADE`;
    console.log("Successfully dropped the country table!");
  } catch (err) {
    console.error("Error dropping table:", err);
  }
}

main();
