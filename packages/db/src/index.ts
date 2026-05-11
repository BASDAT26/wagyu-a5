import pg from "pg";
import { env } from "@wagyu-a5/env/server";

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

export { pool };

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[],
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params);
}
