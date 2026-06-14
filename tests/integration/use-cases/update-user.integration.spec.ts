import { makeUser } from 'tests/factories/make-user.factory';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { updateUserUseCase } from '@/use-cases/update-user.use-case';
import { clearDatabase } from '../../setup';

describe('updateUserUseCase', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('should update a user', async () => {
    const user = await makeUser({
      name: 'John Doe',
      emailVerified: false,
      email: 'john@example.com',
    });

    const updatedUser = await updateUserUseCase({
      id: user.id,
      name: 'Carlos Doe',
      email: 'carlos@example.com',
    });

    expect(updatedUser.name).toBe('Carlos Doe');
    expect(updatedUser.email).toBe('carlos@example.com');
    expect(updatedUser.createdAt).not.toBe(updatedUser.updatedAt);
  });
});
