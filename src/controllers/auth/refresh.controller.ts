import { eq } from 'drizzle-orm';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { signAccessToken } from '@/lib/auth';
import { db } from '@/lib/database';
import { usersTable } from '@/lib/database/schema';
import {
  createRefreshTokenUseCase,
  getRefreshTokenByHashUseCase,
  revokeRefreshTokenUseCase,
} from '@/use-cases/create-refresh-token.use-case';

export const RefreshResponseSchema = z.object({
  accessToken: z.string(),
});

export async function refreshController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    return reply.status(401).send({
      message: 'Invalid refresh token',
      statusCode: 401,
    });
  }

  const tokenRow = await getRefreshTokenByHashUseCase(refreshToken);

  if (!tokenRow || tokenRow.revoked) {
    return reply.status(401).send({
      message: 'Invalid refresh token',
      statusCode: 401,
    });
  }

  if (new Date(tokenRow.expiresAt) < new Date()) {
    return reply.status(401).send({
      message: 'Refresh token expired',
      statusCode: 401,
    });
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, tokenRow.userId))
    .limit(1);

  if (!user) {
    return reply.status(401).send({
      message: 'Invalid refresh token',
      statusCode: 401,
    });
  }

  await revokeRefreshTokenUseCase(tokenRow.id);

  const created = await createRefreshTokenUseCase(user.id);

  const accessToken = signAccessToken(request.server, {
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  reply.setCookie('refreshToken', created.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return reply.send({
    accessToken,
  });
}
