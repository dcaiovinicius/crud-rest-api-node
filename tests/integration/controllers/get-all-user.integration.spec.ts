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

describe('getAllUserController', () => {
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

  it('should get all users', async () => {
    for (let i = 0; i < 10; i++) {
      await makeUser();
    }

    const response = await app.inject({
      method: 'GET',
      url: 'api/v1/users',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveLength(10);
    expect(response.json().meta).toEqual({
      page: 1,
      limit: 10,
      total: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });
});
