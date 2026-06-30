import type { FastifyReply, FastifyRequest } from 'fastify';

import {
  getRefreshTokenByHashUseCase,
  revokeRefreshTokenUseCase,
} from '@/use-cases/create-refresh-token.use-case';

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    reply.clearCookie('refreshToken', { path: '/' });
    return reply.status(200).send({});
  }

  const tokenRow = await getRefreshTokenByHashUseCase(refreshToken);

  if (!tokenRow) {
    return reply.status(200).send({});
  }

  await revokeRefreshTokenUseCase(tokenRow.id);
  reply.clearCookie('refreshToken', { path: '/' });

  return reply.status(200).send({});
}
