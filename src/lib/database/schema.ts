import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'user']);

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').default('user').notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid().notNull(),
  tokenHash: text().notNull(),
  revoked: boolean().default(false).notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
