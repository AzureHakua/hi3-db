import { Elysia, t } from "elysia"

export const skillBody = t.Object({
  skillName: t.String({ error: "Skill name is required" }),
  skillDescription: t.String({ error: "Skill description is required" }),
  unlock: t.UnionEnum(["S", "SS", "SSS"], {
    error: "Unlock must be S, SS, or SSS",
  }),
  imgUrl: t.Nullable(t.String()),
})

export const astralOpBody = t.Object({
  name: t.String({ error: "AstralOp name is required" }),
  imgUrl: t.String({ error: "Image URL is required" }),
  damage: t.String({ error: "Damage type is required" }),
  specializations: t.Optional(
    t.Array(
      t.Object({
        spName: t.String({ error: "Specialization name is required" }),
        spTag: t.String({ error: "Specialization tag is required" }),
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
