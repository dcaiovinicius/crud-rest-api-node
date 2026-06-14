import { randomBytes, randomUUID } from 'node:crypto';
import { createUserUseCase } from '@/use-cases/create-user.use-case';

function generateBase64(length: number) {
  return randomBytes(Math.ceil((length * 3) / 4))
    .toString('base64url')
    .slice(0, length);
}

type MakeUserParams = Partial<{
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
}>;

export async function makeUser(overrides: MakeUserParams = {}) {
  return createUserUseCase({
    name: 'John Doe',
    email: `${generateBase64(10)}@example.com`,
    passwordHash: randomUUID(),
    role: 'user',
    emailVerified: false,
    ...overrides,
  });
}
