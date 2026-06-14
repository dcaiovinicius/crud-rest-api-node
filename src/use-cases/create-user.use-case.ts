import { UserAlreadyExists } from '@/errors';
import { hashPassword } from '@/lib/crypto';
import { db } from '@/lib/database';
import { usersTable } from '@/lib/database/schema';
import { getUserByEmailUseCase } from '@/use-cases/get-user-by-email.use-case';

type User = Omit<typeof usersTable.$inferSelect, 'passwordHash'>;

type CreateUser = Omit<
  typeof usersTable.$inferSelect,
  'id' | 'createdAt' | 'updatedAt'
>;

export async function createUserUseCase(params: CreateUser): Promise<User> {
  const existingUser = await getUserByEmailUseCase(params.email);

  if (existingUser) {
    throw new UserAlreadyExists();
  }

  params.passwordHash = await hashPassword(params.passwordHash);

  const [user] = await db.insert(usersTable).values(params).returning();

  return user;
}
