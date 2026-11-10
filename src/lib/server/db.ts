import { Pool, type QueryResult, type QueryResultRow } from 'pg';

const globalForPg = globalThis as unknown as { hargakuPgPool?: Pool };

function normalizePgUrl(rawUrl: string): string {
  return rawUrl
    .replace(/([?&])sslmode=[^&]+&?/, '$1')
    .replace(/[?&]$/, '');
}

export function getPgPool(): Pool | null {
  if (globalForPg.hargakuPgPool) return globalForPg.hargakuPgPool;

  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl || !rawUrl.trim()) return null;

  const pool = new Pool({
    connectionString: normalizePgUrl(rawUrl.trim()),
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 15000,
    connectionTimeoutMillis: 3500,
  });

  pool.on('error', () => {
    globalForPg.hargakuPgPool = undefined;
  });

  globalForPg.hargakuPgPool = pool;

  return pool;
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  const pool = getPgPool();
  if (!pool) {
    throw new Error('DATABASE_URL is not configured.');
  }
  return pool.query<T>(sql, params);
}
