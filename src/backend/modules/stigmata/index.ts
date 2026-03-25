import { Elysia, t } from "elysia"
import { stigmataModel, stigmataBody } from "./model"
import { getStigmata, postStigmata, patchStigmata, deleteStigmata } from "./service"
import { checkAuth } from "../../utils/auth"
import { RARITIES } from "../../db/enums"

export const stigmataRoutes = new Elysia({ prefix: "/api", tags: ["Stigmata"], detail: { hide: false } })
  .use(stigmataModel)
  .get("/stigmata", getStigmata, {
    query: t.Object({
      id: t.Optional(t.Numeric()),
      name: t.Optional(
        t.String({
          description: "Search term, supports flags: -single/-1, -set/-3, -t/-m/-b, -effect, -id",
        }),
      ),
      limit: t.Optional(
        t.Numeric({
          description: "Limits the number of search results, default: 10",
        }),
      ),
      offset: t.Optional(
        t.Numeric({
          description: "Pagination offset for load more, used when browsing unfiltered results",
        }),
      ),
    }),
    response: {
      200: t.Object({
        data: t.Array(t.Any()),
        hasMore: t.Boolean(),
        hasFlags: t.Boolean(),
      }),
    },
    detail: {
      summary: "Get stigmata",
      description:
        "Returns { data: Stigmata[], hasMore: boolean, hasFlags: boolean }. See schema.ts for full Stigmata type.",
    },
  })
  .post(
    "/stigmata",
    ({ body, headers }) => {
      checkAuth({ headers })
      if (Array.isArray(body)) {
        return Promise.all(body.map((entry) => postStigmata({ body: entry })))
      }
      return postStigmata({ body })
    },
    {
      body: t.Union([stigmataBody, t.Array(stigmataBody)]),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Any() },
      detail: {
        summary: "Create stigmata",
        description: "Create one or multiple stigmata entries. Returns the created object(s) with generated IDs.",
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .patch(
    "/stigmata/:id",
    ({ params, body, headers }) => {
      checkAuth({ headers })
      return patchStigmata({ params, body })
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Partial(
        t.Object({
          name: t.String(),
          rarity: t.UnionEnum(RARITIES, { error: "Rarity must be 1-5" }),
          positions: t.Array(
            t.Object({
              position: t.UnionEnum(["T", "M", "B"], {
                description: "Required to know which position to update",
                error: "Position must be T, M, or B",
              }),
              ...t.Partial(
                t.Object({
                  name: t.String(),
                  skillName: t.String(),
                  skillDescription: t.String(),
                  stats: t.Partial(
                    t.Object({
                      hp: t.Number(),
                      atk: t.Number(),
                      def: t.Number(),
                      crt: t.Number(),
                      sp: t.Number(),
                    }),
                  ),
                }),
              ).properties,
            }),
          ),
          images: t.Array(
            t.Object({
              position: t.UnionEnum(["T", "M", "B"], {
                description: "Required to know which position's image to update",
                error: "Position must be T, M, or B",
              }),
              imgUrl: t.String(),
            }),
          ),
          setEffects: t.Partial(
            t.Object({
              setName: t.String(),
              twoPieceName: t.String(),
              twoPieceEffect: t.String(),
              threePieceName: t.String(),
              threePieceEffect: t.String(),
            }),
          ),
        }),
      ),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Any() },
      detail: {
        summary: "Patch stigmata",
        description: "Updates a single stigmata entry. Returns the updated stigmata object.",
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .delete(
    "/stigmata/:id",
    ({ params, headers }) => {
      checkAuth({ headers })
      return deleteStigmata({ params })
    },
    {
      params: t.Object({ id: t.Numeric() }),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Object({ success: t.Boolean() }) },
      detail: {
        summary: "Delete stigmata",
        description: "Deletes a single stigmata entry. Returns { success: true } on success.",
        security: [{ bearerAuth: [] }],
      },
    },
  )

export { getStigmata } from "./service"
