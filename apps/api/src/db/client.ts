import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "dotenv";

config({
  path: new URL("../../.env", import.meta.url),
  quiet: true,
});

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });

export const closeDatabase = () => client.end();
