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

describe('CreateUserController', () => {
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

  it('should create a new user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        email: 'john@example.com',
        password: 'password',
        name: 'John Doe',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    });
  });

  it('should throw an error if email is already in use', async () => {
    await makeUser({ email: 'john@example.com' });

    const response = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        email: 'john@example.com',
        password: 'password',
        name: 'John Doe',
      },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      message: 'User already exists',
      statusCode: 409,
    });
  });

  it('shold not expose password', async () => {
    const app = await buildApplicationApp();

    const response = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        email: 'john@example.com',
        password: 'password',
        name: 'John Doe',
      },
    });

    expect(response.statusCode).toBe(201);

    expect(response.json()).not.toHaveProperty('password');
    expect(response.json()).not.toHaveProperty('passwordHash');
  });

  it('should not create a new user if email is invalid', async () => {
    const app = await buildApplicationApp();

    const response = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        email: 'invalid-email',
        password: 'password',
        name: 'John Doe',
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

    await app.close();
  });

  it('should not create a new user if password is invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        email: 'john@example.com',
        password: 'pass',
        name: 'John Doe',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: 'Validation failed',
      errors: [
        {
          field: 'password',
          message: 'Password must have at least 8 characters',
        },
      ],
      statusCode: 400,
    });
  });

  it('should not create a new user if empty payload', async () => {
    const response = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: 'Validation failed',
      errors: [
        { field: 'name', message: 'Name is required' },
        { field: 'email', message: 'Invalid email address' },
        { field: 'password', message: 'Password is required' },
      ],
      statusCode: 400,
    });
  });
});
