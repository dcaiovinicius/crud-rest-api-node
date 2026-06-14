import { makeUser } from 'tests/factories/make-user.factory';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';
import { buildApplicationApp } from '@/server';
import { clearDatabase } from '../../setup';

describe('updateUserController', () => {
  let app: Awaited<ReturnType<typeof buildApplicationApp>>;

  beforeAll(async () => {
    app = await buildApplicationApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('should update a user', async () => {
    const user = await makeUser({
      name: 'John Doe',
      email: 'john@example.com',
    });

    const response = await app.inject({
      method: 'PUT',
      url: `api/v1/users/${user.id}`,
      payload: {
        name: 'Carlos Doe',
        email: 'carlos@example.com',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      name: 'Carlos Doe',
      email: 'carlos@example.com',
      role: 'user',
    });
  });

  it('should not update a user if email is invalid', async () => {
    const user = await makeUser({
      name: 'John Doe',
      email: 'john@example.com',
    });

    const response = await app.inject({
      method: 'PUT',
      url: `api/v1/users/${user.id}`,
      payload: {
        name: 'Carlos Doe',
        email: 'invalid-email',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: 'Validation failed',
      errors: [
        {
          field: 'email',
          message: 'Invalid email address',
        },
      ],
      statusCode: 400,
    });
  });
});
