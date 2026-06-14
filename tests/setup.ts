import { sql } from 'drizzle-orm';
import { db } from '@/lib/database';

export async function clearDatabase() {
  const tables = await db.execute(sql`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `);

  const names = tables.rows.map((t) => `"${t.tablename}"`).join(', ');

  if (names) {
    await db.execute(
      sql.raw(`TRUNCATE TABLE ${names} RESTART IDENTITY CASCADE`),
    );
  }
}
