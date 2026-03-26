import { Elysia, t } from "elysia"
import {
  ELEMENTS,
  TYPES,
  WEAPONS,
  STRENGTHS,
  SPECIALIZATIONS,
  SPECIALIZATION_TAGS,
  SKILL_UNLOCKS,
  COSTUME_UNLOCKS,
  RARITIES,
  VALKYRIE_RANKS,
} from "../../db/enums"

export const skillBody = t.Object({
  skillName: t.String({ error: "Skill name is required" }),
  skillDescription: t.String({ error: "Skill description is required" }),
  unlock: t.UnionEnum(SKILL_UNLOCKS, { error: "Invalid unlock requirement" }),
})

export const costumeBody = t.Object({
  name: t.String({ error: "Costume name is required" }),
  imgUrl: t.String({ error: "Costume image URL is required" }),
  rarity: t.UnionEnum(RARITIES, { error: "Rarity must be 1-5" }),
  unlock: t.UnionEnum(COSTUME_UNLOCKS, { error: "Invalid unlock method" }),
  lore: t.Optional(t.String()),
})

export const valkyrieBody = t.Object({
  name: t.String({ error: "Valkyrie name is required" }),
  character: t.String({ error: "Character name is required" }),
  rank: t.UnionEnum(VALKYRIE_RANKS, { error: "Rank must be B, A, SP, or S" }),
  type: t.UnionEnum(TYPES, { error: "Invalid type" }),
  element: t.UnionEnum(ELEMENTS, { error: "Invalid element" }),
  weapon: t.UnionEnum(WEAPONS, { error: "Invalid weapon type" }),
  specialization: t.Optional(
    t.Object({
      spName: t.UnionEnum(SPECIALIZATIONS, { error: "Invalid specialization" }),
      spTag: t.Array(t.UnionEnum(SPECIALIZATION_TAGS, { error: "Invalid specialization tag" })),
    }),
  ),
  strengths: t.Optional(t.Array(t.UnionEnum(STRENGTHS, { error: "Invalid strength" }))),
  skills: t.Object({
    leader: t.Array(skillBody),
    passive: t.Array(skillBody),
    evasion: t.Array(skillBody),
    basicAtk: t.Array(skillBody),
    ultimate: t.Array(skillBody),
    specialAtk: t.Array(skillBody),
    spSkill: t.Optional(t.Array(skillBody)),
    weaponSkill: t.Optional(t.Array(skillBody)),
    astralRing: t.Optional(t.Array(skillBody)),
  }),
  costumes: t.Array(costumeBody),
})

export const valkyrieModel = new Elysia().model({
  "valkyrie.body": valkyrieBody,
  "valkyrie.skill": skillBody,
  "valkyrie.costume": costumeBody,
})

export type ValkyrieBody = typeof valkyrieBody.static
export type SkillBody = typeof skillBody.static
export type CostumeBody = typeof costumeBody.static
