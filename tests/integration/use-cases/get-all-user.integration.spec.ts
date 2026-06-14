import { makeUser } from 'tests/factories/make-user.factory';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getAllUserUseCase } from '@/use-cases/get-all-user.use-case';
import { clearDatabase } from '../../setup';

describe('createUserUseCase', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('should get all users', async () => {
    for (let i = 0; i < 10; i++) {
      await makeUser();
    }

    const users = await getAllUserUseCase({ page: 1, limit: 10 });

    expect(users.data).toHaveLength(10);
    expect(users.meta).toEqual({
      page: 1,
      limit: 10,
      total: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });
});
