import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const stigmata = sqliteTable('stigmata', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    img: text('img').notNull(),
    pos: text('pos').notNull(),
    eff: text('eff').notNull(),
    p2: text('p2'),
    p3: text('p3'),
});

export type InsertStigmata = typeof stigmata.$inferInsert;
export type SelectStigmata = typeof stigmata.$inferSelect;