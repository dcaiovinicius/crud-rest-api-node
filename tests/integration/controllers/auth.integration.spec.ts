import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';
import { buildApplicationApp } from '@/app';
import { clearDatabase } from '../../setup';

describe('Auth flow', () => {
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

  it('should issue a refresh token cookie on login and allow refresh', async () => {
    const createdUser = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: {
        name: 'Auth User',
        email: 'auth@example.com',
        password: 'password123',
      },
    });

    expect(createdUser.statusCode).toBe(201);

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'auth@example.com',
        password: 'password123',
      },
    });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.json()).toHaveProperty('accessToken');

    const setCookieHeader = loginResponse.headers['set-cookie'];

    if (!setCookieHeader) {
      throw new Error('Refresh token cookie was not set');
    }

    const cookieValue = Array.isArray(setCookieHeader)
      ? setCookieHeader[0]
      : setCookieHeader;

    expect(cookieValue).toContain('refreshToken=');

    const refreshResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      headers: {
        cookie: cookieValue.split(';')[0],
      },
    });

    expect(refreshResponse.statusCode).toBe(200);
    expect(refreshResponse.json()).toHaveProperty('accessToken');
  });
});
