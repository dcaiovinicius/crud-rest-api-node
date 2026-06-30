import { createHash, randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/database';
import { refreshTokens } from '@/lib/database/schema';

const DEFAULT_REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_DAYS) || 7;

export async function createRefreshTokenUseCase(userId: string) {
  const token = randomBytes(48).toString('hex');
  const hash = createHash('sha256').update(token).digest('hex');

  const expiresAt = new Date(
    Date.now() + DEFAULT_REFRESH_DAYS * 24 * 60 * 60 * 1000,
  );

  const [row] = await db
    .insert(refreshTokens)
    .values({ userId, tokenHash: hash, revoked: false, expiresAt })
    .returning();

  return { token, id: row.id, expiresAt };
}

export async function getRefreshTokenByHashUseCase(token: string) {
  const hash = createHash('sha256').update(token).digest('hex');

  const [row] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, hash))
    .limit(1);

  return row;
}

export async function revokeRefreshTokenUseCase(id: string) {
  await db
    .update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.id, id));
}

export async function revokeRefreshTokensForUserUseCase(userId: string) {
  await db
    .update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.userId, userId));
}
