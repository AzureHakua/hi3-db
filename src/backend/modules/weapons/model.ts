import { Elysia, t } from "elysia"
import { RARITIES } from "../../db/enums"

export const weaponBody = t.Object({
  name: t.String({ error: "Weapon name is required" }),
  rarity: t.UnionEnum(RARITIES, { error: "Rarity must be 1-5" }),
  atk: t.Number({ error: "ATK must be a number" }),
  crt: t.Number({ error: "CRT must be a number" }),
  baseUrl: t.String({
    description: "Base form of the weapon",
    error: "Base image URL is required",
  }),
  maxUrl: t.String({
    description: "Max form of the weapon",
    error: "Max image URL is required",
  }),
  skills: t.Optional(
    t.Array(
      t.Object({
        skillName: t.String({ error: "Skill name is required" }),
        skillDescription: t.String({ error: "Skill description is required" }),
      }),
    ),
  ),
  lore: t.Optional(t.String()),
})

export const weaponModel = new Elysia().model({
  "weapon.body": weaponBody,
})

export type WeaponBody = typeof weaponBody.static
