import { Elysia, t } from "elysia"
import { getCharacter, postCharacter } from "./service"
import { checkAuth } from "../../utils/auth"

export const characterRoutes = new Elysia({ prefix: "/api", tags: ["Characters"], detail: { hide: false } })
  .get("/character", getCharacter, {
    response: { 200: t.Array(t.Any()) },
    detail: {
      summary: "Get characters",
      description: "Returns a list of all characters ordered by name.",
    },
  })
  .post(
    "/character",
    ({ body, headers }) => {
      checkAuth({ headers })
      if (Array.isArray(body)) {
        return Promise.all(body.map((entry) => postCharacter({ body: entry })))
      }
      return postCharacter({ body })
    },
    {
      body: t.Union([
        t.Object({ name: t.String({ error: "Character name is required" }) }),
        t.Array(t.Object({ name: t.String({ error: "Character name is required" }) })),
      ]),
      headers: t.Object({ authorization: t.String() }),
      response: { 200: t.Any() },
      detail: {
        summary: "Create character",
        description: "Creates a new character. Returns the created character with generated ID.",
        security: [{ bearerAuth: [] }],
      },
    },
  )

export { getCharacter } from "./service"
