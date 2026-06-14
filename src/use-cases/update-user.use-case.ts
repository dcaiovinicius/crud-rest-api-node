import { eq, sql } from 'drizzle-orm';
import { UserAlreadyExists, UserNotFound } from '@/errors';
import { db } from '@/lib/database';
import { usersTable } from '@/lib/database/schema';

export type User = Omit<typeof usersTable.$inferSelect, 'passwordHash'>;

export type UpdateUserInput = {
  id: string;
  name: string;
  email: string;
};

export async function updateUserUseCase(
  params: UpdateUserInput,
): Promise<User> {
  const { id, email, name } = params;

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existingUser[0] && existingUser[0].id !== id) {
    throw new UserAlreadyExists();
  }

  const [updatedUser] = await db
    .update(usersTable)
    .set({
      name,
      email,
      updatedAt: sql`now()`,
    })
    .where(eq(usersTable.id, id))
    .returning();

  if (!updatedUser) {
    throw new UserNotFound();
  }

  return updatedUser;
}
