import { makeUser } from 'tests/factories/make-user.factory';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { UserAlreadyExists } from '@/errors';
import { clearDatabase } from '../../setup';

describe('createUserUseCase', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('should create a new user', async () => {
    const user = await makeUser({
      name: 'John Doe',
      emailVerified: false,
      email: 'john@example.com',
    });

    expect(user.email).toBe('john@example.com');
    expect(user.emailVerified).toBe(false);
    expect(user.name).toBe('John Doe');
    expect(user.role).toBe('user');
  });

  it('should throw an error if email is already in use', async () => {
    const user = await makeUser({ email: 'john@example.com' });

    await expect(makeUser({ email: user.email })).rejects.toThrow(
      UserAlreadyExists,
    );
  });

  it('should create a valid admin user', async () => {
    const user = await makeUser({
      role: 'admin',
    });

    expect(user.role).toBe('admin');
  });
});
