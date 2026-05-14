import pg from "pg";
import { env } from "@wagyu-a5/env/server";
const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
export { pool };
export async function query(text, params) {
  return pool.query(text, params);
}
