import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Required for DigitalOcean PostgreSQL self-signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DB_URI!,
  ssl: true,
});

export const db = drizzle({ client: pool });
