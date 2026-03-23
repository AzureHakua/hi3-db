import { Elysia, t } from "elysia"
import { weaponModel, weaponBody } from "./model"
import { getWeapon, postWeapon, patchWeapon, deleteWeapon } from "./service"
import { checkAuth } from "../../utils/auth"

export const weaponRoutes = new Elysia({ prefix: "/api", tags: ["Weapons"], detail: { hide: false } })
  .use(weaponModel)
  .get("/weapon", getWeapon, {
    query: t.Object({
      id: t.Optional(t.Numeric()),
      name: t.Optional(t.String({ description: "Search term" })),
      limit: t.Optional(t.Numeric({ description: "Limits the number of search results, default: 10" })),
    }),
    response: { 200: t.Any() },
    detail: {
      summary: "Get weapons",
      description: "Returns an array of weapon objects with skills. See schema.ts for full Weapon type.",
    },
  })
  .post(
    "/weapon",
    ({ body, headers }) => {
      checkAuth({ headers })
      if (Array.isArray(body)) {
        return Promise.all(body.map((entry) => postWeapon({ body: entry })))
      }
      return postWeapon({ body })
    },
    {
      body: t.Union([weaponBody, t.Array(weaponBody)]),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Any() },
      detail: {
        summary: "Create weapon",
        description: "Create one or multiple weapon entries. Returns the created object(s) with generated IDs.",
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .patch(
    "/weapon/:id",
    ({ params, body, headers }) => {
      checkAuth({ headers })
      return patchWeapon({ params, body })
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Partial(
        t.Object({
          name: t.String(),
          atk: t.Number(),
          crt: t.Number(),
          baseUrl: t.String({ description: "Base form of the weapon" }),
          maxUrl: t.String({ description: "Max form of the weapon" }),
          skills: t.Array(
            t.Object({
              id: t.Optional(
                t.Number({
                  description: "Skill ID for updating existing skill, omit to add new skill",
                }),
              ),
              skillName: t.Optional(t.String()),
              skillDescription: t.Optional(t.String()),
            }),
          ),
        }),
      ),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Any() },
      detail: {
        summary: "Patch weapon",
        description: "Updates a single weapon entry. Returns the updated weapon object.",
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .delete(
    "/weapon/:id",
    ({ params, headers }) => {
      checkAuth({ headers })
      return deleteWeapon({ params })
    },
    {
      params: t.Object({ id: t.Numeric() }),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Object({ success: t.Boolean() }) },
      detail: {
        summary: "Delete weapon",
        description: "Deletes a single weapon entry. Returns { success: true } on success.",
        security: [{ bearerAuth: [] }],
      },
    },
  )

export { getWeapon } from "./service"
