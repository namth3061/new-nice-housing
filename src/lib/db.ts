import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not set. DB operations will fail.");
}

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
});

export function getPool(): Pool {
  return pool;
}

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> {
  const client = getPool();
  const result = await client.query(text, params);
  return { rows: result.rows as T[], rowCount: result.rowCount };
}
