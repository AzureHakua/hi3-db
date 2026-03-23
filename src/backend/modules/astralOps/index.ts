import { Elysia, t } from "elysia"
import { astralOpModel, astralOpBody, skillBody } from "./model"
import { getAstralOp, postAstralOp, patchAstralOp, deleteAstralOp } from "./service"
import { checkAuth } from "../../utils/auth"

export const astralOpRoutes = new Elysia({ prefix: "/api", tags: ["AstralOps"], detail: { hide: false } })
  .use(astralOpModel)
  .get("/astralop", getAstralOp, {
    query: t.Object({
      id: t.Optional(t.Numeric()),
      name: t.Optional(t.String({ description: "Search term" })),
      limit: t.Optional(t.Numeric({ description: "Limits the number of search results, default: 10" })),
    }),
    response: { 200: t.Any() },
    detail: {
      summary: "Get AstralOps",
      description:
        "Returns an array of AstralOp objects with specializations and skills grouped by category. See schema.ts for full AstralOp type.",
    },
  })
  .post(
    "/astralop",
    ({ body, headers }) => {
      checkAuth({ headers })
      if (Array.isArray(body)) {
        return Promise.all(body.map((entry) => postAstralOp({ body: entry })))
      }
      return postAstralOp({ body })
    },
    {
      body: t.Union([astralOpBody, t.Array(astralOpBody)]),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Any() },
      detail: {
        summary: "Create AstralOp",
        description: "Create one or multiple astralOp entries. Returns the created object(s) with generated IDs.",
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .patch(
    "/astralop/:id",
    ({ params, body, headers }) => {
      checkAuth({ headers })
      return patchAstralOp({ params, body })
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Partial(
        t.Object({
          name: t.String(),
          imgUrl: t.String(),
          damage: t.String(),
          specializations: t.Array(
            t.Object({
              spName: t.String(),
              spTag: t.String(),
            }),
          ),
          skills: t.Object({
            synergy: t.Optional(
              t.Array(
                t.Object({
                  skillOrder: t.Number({ description: "Required - identifies which skill to update" }),
                  ...t.Partial(skillBody).properties,
                }),
              ),
            ),
            recharge: t.Optional(
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
          }),
        }),
      ),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Any() },
      detail: {
        summary: "Patch AstralOp",
        description: "Updates a single astralOp entry. Returns the updated astralOp object.",
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .delete(
    "/astralop/:id",
    ({ params, headers }) => {
      checkAuth({ headers })
      return deleteAstralOp({ params })
    },
    {
      params: t.Object({ id: t.Numeric() }),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Object({ success: t.Boolean() }) },
      detail: {
        summary: "Delete AstralOp",
        description: "Deletes a single astralOp entry. Returns { success: true } on success.",
        security: [{ bearerAuth: [] }],
      },
    },
  )

export { getAstralOp } from "./service"
