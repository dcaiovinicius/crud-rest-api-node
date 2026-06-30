import { randomUUID } from 'node:crypto';
import jwt from '@fastify/jwt';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  jti?: string;
  iss?: string;
  aud?: string;
}

export interface AuthenticatedUser extends JwtPayload {}

export type AuthenticatedFastifyRequest = FastifyRequest & {
  user?: AuthenticatedUser;
};

export const jwtPlugin = fp(async (app: FastifyInstance) => {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me';

  await app.register(jwt, {
    secret,
    sign: {
      expiresIn: '15m',
    },
  });
});

export function signAccessToken(
  app: FastifyInstance,
  payload: JwtPayload,
): string {
  return app.jwt.sign({
    ...payload,
    iss: process.env.JWT_ISSUER || 'crud-rest-api',
    aud: process.env.JWT_AUDIENCE || 'crud-rest-api',
    jti: payload.jti || randomUUID(),
  });
}

export function signRefreshToken(
  app: FastifyInstance,
  payload: JwtPayload,
): string {
  return app.jwt.sign(payload, {
    expiresIn: '7d',
  });
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const authRequest = request as AuthenticatedFastifyRequest;
    const decodedUser = await authRequest.jwtVerify<JwtPayload>();
    authRequest.user = decodedUser;
  } catch {
    return reply.code(401).send({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
}
