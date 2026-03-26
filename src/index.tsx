import { Elysia, file, t } from "elysia"
import { html } from "@elysiajs/html"
import { cors } from "@elysiajs/cors"
import { tailwind } from "@gtramontina.com/elysia-tailwind"
import { openapi } from "@elysiajs/openapi"
import "./styles/tailwind.css"

import { valkyrieRoutes, characterRoutes, stigmataRoutes, weaponRoutes, astralOpRoutes } from "./backend/modules"
import { homePage } from "./pages/Home"
import { valkyriesPage, valkyriesListPage, valkyriesDetailPage } from "./pages/Valkyries"
import { weaponsPage, weaponsListPage, weaponsDetailPage } from "./pages/Weapons"
import { stigmataPage, stigmataListPage, stigmataDetailPage } from "./pages/Stigmata"
import { astralOpsPage, astralOpsListPage, astralOpsDetailPage } from "./pages/AstralOps"
import { aboutPage } from "./pages/About"

const app = new Elysia({
  normalize: true,
  detail: { hide: true },
  nativeStaticResponse: true,
  serve: { idleTimeout: 30 },
})
  .onError(({ code, error }) => {
    if (code === "VALIDATION") return error.all[0]?.message ?? error.message
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
          { name: "Valkyries", description: "Valkyrie data" },
          { name: "Characters", description: "Character data" },
          { name: "Weapons", description: "Weapon data" },
          { name: "Stigmata", description: "Stigmata equipment data" },
          { name: "AstralOps", description: "AstralOp data" },
        ],
      },
      path: "/openapi",
    }),
  )
  .use(valkyrieRoutes)
  .use(characterRoutes)
  .use(stigmataRoutes)
  .use(weaponRoutes)
  .use(astralOpRoutes)
  .get("/favicon.ico", () => file("public/favicon.ico"))
  .get("/img/*", ({ params }) => file(`public/img/${params["*"]}`))
  .get("/js/*", ({ params }) => file(`public/js/${params["*"]}`))
  .get("/", homePage)
  .get("/valkyries", valkyriesPage)
  .get("/valkyries-list", valkyriesListPage, {
    query: t.Object({ search: t.Optional(t.String()) }),
  })
  .get("/valkyries/:id", valkyriesDetailPage, {
    params: t.Object({ id: t.Numeric() }),
  })
  .get("/weapons", weaponsPage)
  .get("/weapons-list", weaponsListPage, {
    query: t.Object({ search: t.Optional(t.String()) }),
  })
  .get("/weapons/:id", weaponsDetailPage, {
    params: t.Object({ id: t.Numeric() }),
  })
  .get("/stigmata", stigmataPage)
  .get("/stigmata-list", stigmataListPage, {
    query: t.Object({
      search: t.Optional(t.String()),
      offset: t.Optional(t.String()),
    }),
  })
  .get("/stigmata/:id", stigmataDetailPage, {
    params: t.Object({ id: t.Numeric() }),
  })
  .get("/astralops", astralOpsPage)
  .get("/astralops-list", astralOpsListPage, {
    query: t.Object({ search: t.Optional(t.String()) }),
  })
  .get("/astralops/:id", astralOpsDetailPage, {
    params: t.Object({ id: t.Numeric() }),
  })
  .get("/about", aboutPage)
  .listen(3000)

const { hostname, port } = app.server!
const protocol = process.env.NODE_ENV === "production" ? "https" : "http"

console.log(`🦊 Elysia is running at ${protocol}://${hostname}:${port}`)
console.log(`📚 API docs available at ${protocol}://${hostname}:${port}/openapi`)
