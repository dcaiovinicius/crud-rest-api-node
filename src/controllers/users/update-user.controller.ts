import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { updateUserUseCase } from '@/use-cases/update-user.use-case';

export const UpdateUserBodySchema = z.object({
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
});

export const UpdateUserRequestParamsSchema = z.object({
  id: z.uuid({
    error: 'Invalid user id',
  }),
});

export const UpdateUserReponseSchema = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(['user', 'admin']),
});

export async function updateUserController(
  request: FastifyRequest<{
    Body: z.infer<typeof UpdateUserBodySchema>;
    Params: z.infer<typeof UpdateUserRequestParamsSchema>;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const { email, name } = request.body;

  const user = await updateUserUseCase({
    name,
    email,
    id,
  });

  const response = UpdateUserReponseSchema.parse(user);

  return reply.status(200).send(response);
}
