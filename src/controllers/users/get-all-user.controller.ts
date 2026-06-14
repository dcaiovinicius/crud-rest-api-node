import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { getAllUserUseCase } from '@/use-cases/get-all-user.use-case';

export const GetUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const GetUsersResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      email: z.email(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export async function getUsersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page, limit } = GetUsersQuerySchema.parse(request.query);

  const users = await getAllUserUseCase({
    page,
    limit,
  });

  const response = GetUsersResponseSchema.parse(users);

  return reply.status(200).send(response);
}
