import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const stigmata = sqliteTable('stigmata', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    img: text('img'),
    pos: text('pos'),
    eff: text('eff'),
    p2: text('p2'),
    p3: text('p3'),
});

export const usersTable = sqliteTable('users', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    age: integer('age').notNull(),
    email: text('email').unique().notNull(),
  });

export type InsertStigmata = typeof stigmata.$inferInsert;
export type SelectStigmata = typeof stigmata.$inferSelect;

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;