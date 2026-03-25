import { Elysia, t } from "elysia"
import { RARITIES } from "../../db/enums"

// Stats shape used in positions
const statsBody = t.Object({
  hp: t.Nullable(t.Number({ error: "HP must be a number or null" })),
  atk: t.Nullable(t.Number({ error: "ATK must be a number or null" })),
  def: t.Nullable(t.Number({ error: "DEF must be a number or null" })),
  crt: t.Nullable(t.Number({ error: "CRT must be a number or null" })),
  sp: t.Nullable(t.Number({ error: "SP must be a number or null" })),
})

// Set effects shape
const setEffectsBody = t.Partial(
  t.Object({
    setName: t.String(),
    twoPieceName: t.String(),
    twoPieceEffect: t.String(),
    threePieceName: t.String(),
    threePieceEffect: t.String(),
  }),
)

// Full stigmata body
export const stigmataBody = t.Object({
  name: t.String({ error: "Stigmata name is required" }),
  rarity: t.UnionEnum(RARITIES, {error: "Rarity must be 1-5"}),
  positions: t.Optional(
    t.Array(
      t.Object({
        position: t.UnionEnum(["T", "M", "B"], { error: "Position must be T, M, or B" }),
        name: t.String({ error: "Position name is required" }),
        skillName: t.String({ error: "Skill name is required" }),
        skillDescription: t.String({ error: "Skill description is required" }),
        stats: statsBody,
      }),
    ),
  ),
  images: t.Array(
    t.Object({
      position: t.UnionEnum(["T", "M", "B"], { error: "Position must be T, M, or B" }),
      imgUrl: t.String({ error: "Image URL is required" }),
    }),
  ),
  setEffects: t.Optional(setEffectsBody),
})

export const stigmataModel = new Elysia().model({
  "stigmata.body": stigmataBody,
  "stigmata.setEffects": setEffectsBody,
  "stigmata.stats": statsBody,
})

export type StigmataBody = typeof stigmataBody.static
