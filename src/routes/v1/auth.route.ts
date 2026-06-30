import type { FastifyInstance } from 'fastify';
import {
  LoginBodySchema,
  LoginResponseSchema,
  loginController,
} from '@/controllers/auth/login.controller';
import { logoutController } from '@/controllers/auth/logout.controller';
import { meController } from '@/controllers/auth/me.controller';
import {
  RefreshResponseSchema,
  refreshController,
} from '@/controllers/auth/refresh.controller';
import { authenticate } from '@/lib/auth';

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/auth/login',
    {
      preHandler: [app.rateLimit({ max: 5, timeWindow: '1 minute' })],
      schema: {
        tags: ['Auth'],
        summary: 'Login and receive tokens',
        body: LoginBodySchema,
        response: {
          200: LoginResponseSchema,
        },
      },
    },
    loginController,
  );

  app.get(
    '/auth/me',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Auth'],
        summary: 'Get current authenticated user',
      },
    },
    meController,
  );

  app.post(
    '/auth/refresh',
    {
      preHandler: [app.rateLimit({ max: 10, timeWindow: '1 minute' })],
      schema: {
        tags: ['Auth'],
        summary: 'Rotate refresh token and get a new access token',
        response: {
          200: RefreshResponseSchema,
        },
      },
    },
    refreshController,
  );

  app.post(
    '/auth/logout',
    {
      preHandler: [app.rateLimit({ max: 10, timeWindow: '1 minute' })],
      schema: {
        tags: ['Auth'],
        summary: 'Logout and revoke refresh token',
      },
    },
    logoutController,
  );
}
