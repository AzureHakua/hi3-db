import { Elysia, t } from "elysia"
import { valkyrieModel, valkyrieBody, skillBody } from "./model"
import { getValkyrie, postValkyrie, patchValkyrie, deleteValkyrie } from "./service"
import { checkAuth } from "../../utils/auth"
import {
  ELEMENTS,
  TYPES,
  WEAPONS,
  STRENGTHS,
  SPECIALIZATIONS,
  SPECIALIZATION_TAGS,
  COSTUME_UNLOCKS,
  RARITIES,
  VALKYRIE_RANKS,
} from "../../db/enums"

export const valkyrieRoutes = new Elysia({ prefix: "/api", tags: ["Valkyries"], detail: { hide: false } })
  .use(valkyrieModel)
  .get("/valkyrie", getValkyrie, {
    query: t.Object({
      id: t.Optional(t.Numeric()),
      name: t.Optional(t.String({ description: "Search term" })),
      limit: t.Optional(t.Numeric({ description: "Limits the number of search results, default: 10" })),
    }),
    response: { 200: t.Array(t.Any()) },
    detail: {
      summary: "Get valkyries",
      description: "Returns an array of valkyrie objects with full data. See schema.ts for full Valkyrie type.",
    },
  })
  .post(
    "/valkyrie",
    ({ body, headers }) => {
      checkAuth({ headers })
      if (Array.isArray(body)) {
        return Promise.all(body.map((entry) => postValkyrie({ body: entry })))
      }
      return postValkyrie({ body })
    },
    {
      body: t.Union([valkyrieBody, t.Array(valkyrieBody)]),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Any() },
      detail: {
        summary: "Create valkyrie",
        description:
          "Create one or multiple valkyrie entries. Character must exist before posting. Returns the created object(s) with generated IDs.",
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .patch(
    "/valkyrie/:id",
    ({ params, body, headers }) => {
      checkAuth({ headers })
      return patchValkyrie({ params, body })
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Partial(
        t.Object({
          name: t.String(),
          character: t.String(),
          rank: t.UnionEnum(VALKYRIE_RANKS, { error: "Rank must be B, A, SP, or S" }),
          type: t.UnionEnum(TYPES, { error: "Invalid type" }),
          element: t.UnionEnum(ELEMENTS, { error: "Invalid element" }),
          weapon: t.UnionEnum(WEAPONS, { error: "Invalid weapon type" }),
          specialization: t.Object({
            spName: t.UnionEnum(SPECIALIZATIONS, { error: "Invalid specialization" }),
            spTag: t.Array(t.UnionEnum(SPECIALIZATION_TAGS, { error: "Invalid specialization tag" })),
          }),
          strengths: t.Array(t.UnionEnum(STRENGTHS, { error: "Invalid strength" })),
          skills: t.Object({
            leader: t.Optional(
              t.Array(
                t.Object({
                  skillOrder: t.Number({ description: "Required - identifies which skill to update" }),
                  ...t.Partial(skillBody).properties,
                }),
              ),
            ),
            passive: t.Optional(
              t.Array(
                t.Object({
                  skillOrder: t.Number({ description: "Required - identifies which skill to update" }),
                  ...t.Partial(skillBody).properties,
                }),
              ),
            ),
            evasion: t.Optional(
              t.Array(
                t.Object({
                  skillOrder: t.Number({ description: "Required - identifies which skill to update" }),
                  ...t.Partial(skillBody).properties,
                }),
              ),
            ),
            basicAtk: t.Optional(
              t.Array(
                t.Object({
                  skillOrder: t.Number({ description: "Required - identifies which skill to update" }),
                  ...t.Partial(skillBody).properties,
                }),
              ),
            ),
            ultimate: t.Optional(
              t.Array(
                t.Object({
                  skillOrder: t.Number({ description: "Required - identifies which skill to update" }),
                  ...t.Partial(skillBody).properties,
                }),
              ),
            ),
            specialAtk: t.Optional(
              t.Array(
                t.Object({
                  skillOrder: t.Number({ description: "Required - identifies which skill to update" }),
                  ...t.Partial(skillBody).properties,
                }),
              ),
            ),
            spSkill: t.Optional(
              t.Array(
                t.Object({
                  skillOrder: t.Number({ description: "Required - identifies which skill to update" }),
                  ...t.Partial(skillBody).properties,
                }),
              ),
            ),
            weaponSkill: t.Optional(
              t.Array(
                t.Object({
                  skillOrder: t.Number({ description: "Required - identifies which skill to update" }),
                  ...t.Partial(skillBody).properties,
                }),
              ),
            ),
            astralRing: t.Optional(
              t.Array(
                t.Object({
                  skillOrder: t.Number({ description: "Required - identifies which skill to update" }),
                  ...t.Partial(skillBody).properties,
                }),
              ),
            ),
          }),
          costumes: t.Array(
            t.Object({
              name: t.String({ description: "Required - identifies which costume to update" }),
              imgUrl: t.Optional(t.String()),
              rarity: t.Optional(t.UnionEnum(RARITIES, { error: "Rarity must be 1-5" })),
              unlock: t.Optional(t.UnionEnum(COSTUME_UNLOCKS, { error: "Invalid unlock method" })),
              lore: t.Optional(t.String()),
            }),
          ),
        }),
      ),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Any() },
      detail: {
        summary: "Patch valkyrie",
        description: "Updates a single valkyrie entry. Returns the updated valkyrie object.",
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .delete(
    "/valkyrie/:id",
    ({ params, headers }) => {
      checkAuth({ headers })
      return deleteValkyrie({ params })
    },
    {
      params: t.Object({ id: t.Numeric() }),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Object({ success: t.Boolean() }) },
      detail: {
        summary: "Delete valkyrie",
        description: "Deletes a single valkyrie entry and all related data. Returns { success: true } on success.",
        security: [{ bearerAuth: [] }],
      },
    },
  )

export { getValkyrie } from "./service"
