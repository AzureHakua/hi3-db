import { Elysia, t } from "elysia"
import { ELEMENTS, SPECIALIZATIONS, SPECIALIZATION_TAGS } from "../../db/enums"

export const skillBody = t.Object({
  skillName: t.String({ error: "Skill name is required" }),
  skillDescription: t.String({ error: "Skill description is required" }),
  unlock: t.UnionEnum(["S", "SS", "SSS"], {
    error: "Unlock must be S, SS, or SSS",
  }),
})

export const astralOpBody = t.Object({
  name: t.String({ error: "AstralOp name is required" }),
  imgUrl: t.String({ error: "Image URL is required" }),
  element: t.UnionEnum(ELEMENTS, { error: "Element type is required" }),
  specializations: t.Optional(
    t.Array(
      t.Object({
        spName: t.UnionEnum(SPECIALIZATIONS, { error: "Specialization name is required" }),
        spTag: t.UnionEnum(SPECIALIZATION_TAGS, { error: "Specialization tag is required" }),
      }),
    ),
  ),
  skills: t.Object({
    synergy: t.Array(skillBody),
    recharge: t.Array(skillBody),
    passive: t.Array(skillBody),
  }),
})

export const astralOpModel = new Elysia().model({
  "astralop.body": astralOpBody,
  "astralop.skill": skillBody,
})

export type AstralOpBody = typeof astralOpBody.static
export type SkillBody = typeof skillBody.static
