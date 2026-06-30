import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { signAccessToken } from '@/lib/auth';
import { verifyPassword } from '@/lib/crypto';
import { createRefreshTokenUseCase } from '@/use-cases/create-refresh-token.use-case';
import { getUserByEmailUseCase } from '@/use-cases/get-user-by-email.use-case';

export const LoginBodySchema = z.object({
  email: z.email({ error: 'Invalid email' }),
  password: z.string({ error: 'Password is required' }),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
});

export async function loginController(
  request: FastifyRequest<{ Body: z.infer<typeof LoginBodySchema> }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;

  const user = await getUserByEmailUseCase(email);

  if (!user) {
    return reply
      .status(401)
      .send({ message: 'Invalid credentials', statusCode: 401 });
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return reply
      .status(401)
      .send({ message: 'Invalid credentials', statusCode: 401 });
  }

  const payload = { sub: user.id, email: user.email, role: user.role };

  const accessToken = signAccessToken(request.server, payload);
  const refreshToken = await createRefreshTokenUseCase(user.id);

  reply.setCookie('refreshToken', refreshToken.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  const response = LoginResponseSchema.parse({ accessToken });

  return reply.status(200).send(response);
}
