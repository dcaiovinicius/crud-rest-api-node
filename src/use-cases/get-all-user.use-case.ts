import { count, desc } from 'drizzle-orm';
import { db } from '@/lib/database';
import { usersTable } from '@/lib/database/schema';

type GetUsersInput = {
  page: number;
  limit: number;
};

export async function getAllUserUseCase({ page, limit }: GetUsersInput) {
  const offset = (page - 1) * limit;

  const [{ total }] = await db
    .select({
      total: count(),
    })
    .from(usersTable);

  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    })
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt))
    .limit(limit)
    .offset(offset);

  const totalPages = Math.ceil(total / limit);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
