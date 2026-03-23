import { Elysia, file, t } from "elysia"
import { html } from "@elysiajs/html"
import { cors } from "@elysiajs/cors"
import { tailwind } from "@gtramontina.com/elysia-tailwind"
import { openapi, fromTypes } from "@elysiajs/openapi"
import "./styles/tailwind.css"

import { stigmataRoutes, weaponRoutes, astralOpRoutes } from "./backend/routes"
import { homePage } from "./pages/Home"
import { valkyriesPage } from "./pages/Valkyries"
import { weaponsPage, weaponsListPage } from "./pages/Weapons"
import { stigmataPage, stigmataListPage, stigmataPositionPage } from "./pages/Stigmata"
import { astralOpsPage, astralOpsListPage, astralOpSkillPage } from "./pages/AstralOps"
import { aboutPage } from "./pages/About"

const app = new Elysia({
  normalize: true,
  detail: { hide: true },
  nativeStaticResponse: true,
  serve: { idleTimeout: 30 },
})
  .use(html())
  .use(cors())
  .use(
    tailwind({
      path: "/styles/stylesheet.css",
      source: "./src/styles/tailwind.css",
      config: "./tailwind.config.js",
      options: { minify: true, map: true, autoprefixer: false },
    }),
  )
  .use(
    openapi({
      documentation: {
        info: {
          title: "Prometheus Database API",
          version: "1.2.0",
          description: "An API for Honkai Impact 3rd game data",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
            },
          },
        },
        tags: [
          { name: "Stigmata", description: "Stigmata equipment data" },
          { name: "Weapons", description: "Weapon data" },
          { name: "AstralOps", description: "AstralOp data" },
        ],
      },
      path: "/openapi",
    }),
  )
  .use(stigmataRoutes)
  .use(weaponRoutes)
  .use(astralOpRoutes)
  .get("/favicon.ico", () => file("public/favicon.ico"))
  .get("/img/*", ({ params }) => file(`public/img/${params["*"]}`))
  .get("/js/*", ({ params }) => file(`public/js/${params["*"]}`))
  .get("/", homePage)
  .get("/valkyries", valkyriesPage)
  .get("/weapons", weaponsPage)
  .get("/weapon-list", weaponsListPage, {
    query: t.Object({ search: t.Optional(t.String()) }),
  })
  .get("/stigmata", stigmataPage)
  .get("/stigmata-list", stigmataListPage, {
    query: t.Object({
      search: t.Optional(t.String()),
      offset: t.Optional(t.String()),
    }),
  })
  .get("/stigmata/:id/position/:index", stigmataPositionPage, {
    params: t.Object({ id: t.Numeric(), index: t.Numeric() }),
  })
  .get("/astralops", astralOpsPage)
  .get("/astralops-list", astralOpsListPage, {
    query: t.Object({ search: t.Optional(t.String()) }),
  })
  .get("/astralop/:id/skill/:category/:index", astralOpSkillPage, {
    params: t.Object({
      id: t.Numeric(),
      category: t.String(),
      index: t.Numeric(),
    }),
  })
  .get("/about", aboutPage)
  .listen(3000)

const { hostname, port } = app.server!
const protocol = process.env.NODE_ENV === "production" ? "https" : "http"

console.log(`🦊 Elysia is running at ${protocol}://${hostname}:${port}`)
console.log(`📚 API docs available at ${protocol}://${hostname}:${port}/openapi`)
