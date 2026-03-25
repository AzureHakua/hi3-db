import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

// Valkyrie schemas start ehre
// Character table
export const character = sqliteTable("character", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
})

// Core valkyrie table
export const valkyrie = sqliteTable("valkyrie", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id").notNull().references(() => character.id),
  name: text("name").notNull(),
  rank: text("rank").notNull(),
  type: text("type").notNull(),
  element: text("element").notNull(),
  weapon: text("weapon").notNull(),
})

// Specialization — 0 or 1 per valkyrie
export const valkyrieSpecialization = sqliteTable("valkyrie_specialization", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  valkyrieId: integer("valkyrie_id").notNull().references(() => valkyrie.id),
  spName: text("sp_name").notNull(),
})

// Specialization tags — 1 or more per specialization
export const valkyrieSpecializationTags = sqliteTable("valkyrie_specialization_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  specializationId: integer("specialization_id").notNull().references(() => valkyrieSpecialization.id),
  spTag: text("sp_tag").notNull(),
})

// Strengths — 1 or more per valkyrie
export const valkyrieStrengths = sqliteTable("valkyrie_strengths", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  valkyrieId: integer("valkyrie_id").notNull().references(() => valkyrie.id),
  strength: text("strength").notNull(),
})

// Skills
export const valkyrieSkills = sqliteTable("valkyrie_skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  valkyrieId: integer("valkyrie_id").notNull().references(() => valkyrie.id),
  category: text("category").notNull(),
  skillOrder: integer("skill_order").notNull(),
  skillName: text("skill_name").notNull(),
  skillDescription: text("skill_description").notNull(),
  unlock: text("unlock").notNull().default("Default"),
})

// Costumes
export const valkyrieCostumes = sqliteTable("valkyrie_costumes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  valkyrieId: integer("valkyrie_id").notNull().references(() => valkyrie.id),
  name: text("name").notNull(),
  imgUrl: text("img_url").notNull(),
  rarity: integer("rarity").notNull().default(4),
  unlock: text("unlock").notNull().default("Default"),
  lore: text("lore"),
})

// Types
export type InsertValkyrie = typeof valkyrie.$inferInsert
export type SelectValkyrie = typeof valkyrie.$inferSelect & {
  character: typeof character.$inferSelect
  specialization: (typeof valkyrieSpecialization.$inferSelect & {
    tags: typeof valkyrieSpecializationTags.$inferSelect[]
  }) | null
  strengths: typeof valkyrieStrengths.$inferSelect[]
  skills: typeof valkyrieSkills.$inferSelect[]
  costumes: typeof valkyrieCostumes.$inferSelect[]
}

export type InsertCharacter = typeof character.$inferInsert
export type SelectCharacter = typeof character.$inferSelect

// stigmata schemas start here
export const stigmata = sqliteTable("stigmata", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  rarity: integer("rarity").notNull().default(4),
})

export const stigmataPositions = sqliteTable("stigmata_positions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stigmataId: integer("stigmata_id")
    .notNull()
    .references(() => stigmata.id),
  position: text("position").notNull(),
  name: text("name").notNull(),
  skillName: text("skill_name"),
  skillDescription: text("skill_description"),
})

export const stigmataStats = sqliteTable("stigmata_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  positionId: integer("position_id")
    .notNull()
    .references(() => stigmataPositions.id),
  hp: integer("hp"),
  atk: integer("atk"),
  def: integer("def"),
  crt: integer("crt"),
  sp: integer("sp"),
})

export const stigmataImages = sqliteTable("stigmata_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stigmataId: integer("stigmata_id")
    .notNull()
    .references(() => stigmata.id),
  position: text("position").notNull(),
  imgUrl: text("img_url"),
})

export const stigmataSetEffects = sqliteTable("stigmata_set_effects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stigmataId: integer("stigmata_id")
    .notNull()
    .references(() => stigmata.id),
  setName: text("set_name"),
  twoPieceName: text("two_piece_name"),
  twoPieceEffect: text("two_piece_effect"),
  threePieceName: text("three_piece_name"),
  threePieceEffect: text("three_piece_effect"),
})

export type InsertStigmata = typeof stigmata.$inferInsert
export type SelectStigmata = typeof stigmata.$inferSelect & {
  positions: (typeof stigmataPositions.$inferSelect & {
    stats: typeof stigmataStats.$inferSelect
  })[]
  images: (typeof stigmataImages.$inferSelect)[]
  setEffects: typeof stigmataSetEffects.$inferSelect
}

// weapon schemas start here
export const weapon = sqliteTable("weapon", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  rarity: integer("rarity").notNull().default(5),
  atk: integer("atk").notNull(),
  crt: integer("crt").notNull(),
  baseUrl: text("base_url").notNull(),
  maxUrl: text("max_url").notNull(),
  lore: text("lore"),
})

export const weaponSkills = sqliteTable("weapon_skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weaponId: integer("weapon_id")
    .notNull()
    .references(() => weapon.id),
  skillName: text("skill_name").notNull(),
  skillDescription: text("skill_description").notNull(),
})

export type InsertWeapon = typeof weapon.$inferInsert
export type SelectWeapon = typeof weapon.$inferSelect & {
  skills: (typeof weaponSkills.$inferSelect)[]
}

// astralop schemas start here
export const astralop = sqliteTable("astralop", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  imgUrl: text("img_url"),
  element: text("element").notNull(),
})

export const astralOpSpecializations = sqliteTable("astralop_specializations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  astralOpId: integer("astralop_id")
    .notNull()
    .references(() => astralop.id),
  spName: text("sp_name").notNull(),
  spTag: text("sp_tag").notNull(),
})

export const astralOpSkills = sqliteTable("astralop_skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  astralOpId: integer("astralop_id")
    .notNull()
    .references(() => astralop.id),
  category: text("category").notNull(),
  skillOrder: integer("skill_order").notNull(),
  skillName: text("skill_name").notNull(),
  skillDescription: text("skill_description").notNull(),
  unlock: text("unlock").notNull(),
})

export type InsertAstralOp = typeof astralop.$inferInsert
export type SelectAstralOp = typeof astralop.$inferSelect & {
  specializations: (typeof astralOpSpecializations.$inferSelect)[]
  skills: {
    synergy: (typeof astralOpSkills.$inferSelect)[]
    recharge: (typeof astralOpSkills.$inferSelect)[]
    passive: (typeof astralOpSkills.$inferSelect)[]
  }
}
