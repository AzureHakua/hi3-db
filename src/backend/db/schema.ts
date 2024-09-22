import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const stigmata = sqliteTable('stigmata', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
});

export const stigmataPositions = sqliteTable('stigmata_positions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    stigmataId: integer('stigmata_id').notNull().references(() => stigmata.id),
    position: text('position').notNull(),
    name: text('name').notNull(),
    skillName: text('skill_name'),
    skillDescription: text('skill_description'),
});

export const stigmataStats = sqliteTable('stigmata_stats', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    positionId: integer('position_id').notNull().references(() => stigmataPositions.id),
    hp: integer('hp'),
    atk: integer('atk'),
    def: integer('def'),
    crt: integer('crt'),
    sp: integer('sp'),
});

export const stigmataImages = sqliteTable('stigmata_images', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    stigmataId: integer('stigmata_id').notNull().references(() => stigmata.id),
    position: text('position').notNull(),
    iconUrl: text('icon_url'),
    bigUrl: text('big_url'),
});

export const stigmataSetEffects = sqliteTable('stigmata_set_effects', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    stigmataId: integer('stigmata_id').notNull().references(() => stigmata.id),
    setName: text('set_name'),
    twoPieceName: text('two_piece_name'),
    twoPieceEffect: text('two_piece_effect'),
    threePieceName: text('three_piece_name'),
    threePieceEffect: text('three_piece_effect'),
});

export type InsertStigmata = typeof stigmata.$inferInsert;
export type SelectStigmata = typeof stigmata.$inferSelect & {
    positions: (typeof stigmataPositions.$inferSelect & {
        stats: typeof stigmataStats.$inferSelect
    })[];
    images: typeof stigmataImages.$inferSelect[];
    setEffects: typeof stigmataSetEffects.$inferSelect;
};


export const weapon = sqliteTable('weapon', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    atk: integer('atk'),
    crt: integer('crt'),
});

export const weaponImages = sqliteTable('weapon_images', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    weaponId: integer('weapon_id').notNull().references(() => weapon.id),
    baseUrl: text('base_url'),
    maxUrl: text('max_url'),
});

export const weaponSkills = sqliteTable('weapon_skills', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    weaponId: integer('weapon_id').notNull().references(() => weapon.id),
    skillName: text('skill_name').notNull(),
    skillDescription: text('skill_description').notNull(),
});

export type InsertWeapon = typeof weapon.$inferInsert;
export type SelectWeapon = typeof weapon.$inferSelect & {
    images: typeof weaponImages.$inferSelect[];
    skills: typeof weaponSkills.$inferSelect[];
};