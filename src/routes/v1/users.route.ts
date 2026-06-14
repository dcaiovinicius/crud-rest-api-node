import type { FastifyInstance } from 'fastify';

import {
  CreateUserBodySchema,
  CreateUserResponseSchema,
  createUserController,
} from '@/controllers/users/create-user.controller';
import {
  GetUsersQuerySchema,
  GetUsersResponseSchema,
  getUsersController,
} from '@/controllers/users/get-all-user.controller';
import {
  UpdateUserBodySchema,
  UpdateUserReponseSchema,
  UpdateUserRequestParamsSchema,
  updateUserController,
} from '@/controllers/users/update-user.controller';

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'Create a new user',
        body: CreateUserBodySchema,
        response: {
          201: CreateUserResponseSchema,
        },
      },
    },
    createUserController,
  );

  app.get(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'List users',
        querystring: GetUsersQuerySchema,
        response: {
          200: GetUsersResponseSchema,
        },
      },
    },
    getUsersController,
  );

  app.put(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        summary: 'Update a user',
        body: UpdateUserBodySchema,
        params: UpdateUserRequestParamsSchema,
        response: {
          200: UpdateUserReponseSchema,
        },
      },
    },
    updateUserController,
  );
}
