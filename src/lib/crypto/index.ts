import bcrypt from 'bcryptjs';

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

export async function hashPassword(password: string) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return passwordHash;
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
