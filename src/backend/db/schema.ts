import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const stigmata = sqliteTable('stigmata', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
});

export const positions = sqliteTable('positions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    stigmataId: integer('stigmata_id').notNull().references(() => stigmata.id),
    position: text('position').notNull(),
    name: text('name').notNull(),
    skillName: text('skill_name'),
    skillDescription: text('skill_description'),
});

export const stats = sqliteTable('stats', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    positionId: integer('position_id').notNull().references(() => positions.id),
    hp: integer('hp'),
    atk: integer('atk'),
    def: integer('def'),
    crt: integer('crt'),
    sp: integer('sp'),
});

export const images = sqliteTable('images', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    stigmataId: integer('stigmata_id').notNull().references(() => stigmata.id),
    position: text('position').notNull(),
    iconUrl: text('icon_url'),
    bigUrl: text('big_url'),
});

export const setEffects = sqliteTable('set_effects', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    stigmataId: integer('stigmata_id').notNull().references(() => stigmata.id),
    setName: text('set_name'),
    twoPieceName: text('two_piece_name'),
    twoPieceEffect: text('two_piece_effect'),
    threePieceName: text('three_piece_name'),
    threePieceEffect: text('three_piece_effect'),
});

export type InsertStigmata = typeof stigmata.$inferInsert;
export type SelectStigmata = typeof stigmata.$inferSelect;