import { eq } from 'drizzle-orm';
import { db } from '@/lib/database';
import { usersTable } from '@/lib/database/schema';

export async function getUserByEmailUseCase(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  return user;
}
