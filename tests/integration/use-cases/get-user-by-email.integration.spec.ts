import { makeUser } from 'tests/factories/make-user.factory';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getUserByEmailUseCase } from '@/use-cases/get-user-by-email.use-case';
import { clearDatabase } from '../../setup';

describe('getUserByEmailUseCase', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('should get a user by email', async () => {
    await makeUser({
      name: 'John Doe',
      email: 'john@example.com',
    });

    const user = await getUserByEmailUseCase('john@example.com');

    expect(user).toBeDefined();
    expect(user.email).toBe('john@example.com');
    expect(user.name).toBe('John Doe');
  });
});
