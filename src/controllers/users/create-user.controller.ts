import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { createUserUseCase } from '@/use-cases/create-user.use-case';

export const CreateUserBodySchema = z.object({
  name: z
    .string({
      error: 'Name is required',
    })
    .min(3, {
      error: 'Name must have at least 3 characters',
    }),

  email: z.email({
    error: 'Invalid email address',
  }),

  password: z
    .string({
      error: 'Password is required',
    })
    .min(8, {
      error: 'Password must have at least 8 characters',
    }),
});

export const CreateUserResponseSchema = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(['user', 'admin']),
});

export async function createUserController(
  request: FastifyRequest<{ Body: z.infer<typeof CreateUserBodySchema> }>,
  reply: FastifyReply,
) {
  const { email, password, name } = request.body;

  const user = await createUserUseCase({
    name,
    email,
    passwordHash: password,
    role: 'user',
    emailVerified: false,
  });

  const response = CreateUserResponseSchema.parse(user);

  return reply.status(201).send(response);
}
