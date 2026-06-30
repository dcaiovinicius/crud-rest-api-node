import { eq } from 'drizzle-orm';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '@/lib/database';
import { usersTable } from '@/lib/database/schema';

export async function meController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userPayload = request.user as {
    sub: string;
    email: string;
    role: string;
  };

  if (!userPayload?.sub) {
    return reply.status(401).send({ message: 'Unauthorized', statusCode: 401 });
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userPayload.sub))
    .limit(1);

  if (!user) {
    return reply
      .status(404)
      .send({ message: 'User not found', statusCode: 404 });
  }

  const { id, name, email, role, emailVerified, createdAt, updatedAt } = user;

  return reply.send({
    id,
    name,
    email,
    role,
    emailVerified,
    createdAt,
    updatedAt,
  });
}
