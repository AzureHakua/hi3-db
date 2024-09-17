import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { cors } from '@elysiajs/cors'
import { tailwind } from '@gtramontina.com/elysia-tailwind'
import { swagger } from '@elysiajs/swagger'
import { stigmataRoutes, getStigmata } from './backend/routes/stigmata'
import { StigmataList } from './components/StigmataList'
import { Sidebar } from './components/Sidebar'
import './styles/tailwind.css'

const app = new Elysia()
  .use(html())
  .use(cors())
  .use(tailwind({
    path: "/styles/stylesheet.css",
    source: "./src/styles/tailwind.css",
    config: "./tailwind.config.js",
    options: {
      minify: true,
      map: true,
      autoprefixer: false
    }
  }))
  .use(swagger())
  .use(stigmataRoutes)

const Layout = ({ children }: { children: JSX.Element }) => (
  <html lang="en">
    <head>
      <title>Hi~ Elysia</title>
      <link href="/styles/stylesheet.css" rel="stylesheet" />
      <script src="https://unpkg.com/htmx.org@2.0.2"></script>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body class="bg-slate-900 text-slate-300">
      <div class="flex">
        <Sidebar />
        <div class="flex-1 w-full">
          <main class="max-w-4x1 w-full p-8 mx-auto">
            {children}
          </main>
        </div>
      </div>
    </body>
  </html>
)

app.get('/', () => (
  <Layout>
    <>
      <h1 class="text-3xl font-bold mb-4 text-center">Welcome to Prometheus DB</h1>
      <p class="text-center">A (WIP) database for Honkai Impact 3rd</p>
    </>
  </Layout>
))

app.get('/stigmata', () => (
  <Layout>
    <>
      <div class="flex justify-center m-4">
        <input
          type="text"
          id="search-input"
          name="search"
          placeholder="Search stigmata..."
          class="max-w-4xl 3xl:max-w-screen-xl w-full p-2 my-2 rounded-md bg-slate-800 text-white"
          hx-trigger="keyup changed delay:500ms"
          hx-get="/stigmata-list"
          hx-target="#stigmata-list"
        />
      </div>
      <div id="stigmata-list" hx-get='/stigmata-list' hx-trigger='load'></div>
    </>
  </Layout>
))

app.get('/stigmata-list', async ({ query }) => {
  try {
    const searchTerm = query.search as string || '';
    const stigmata = await getStigmata({
      query: {
        name: searchTerm ? { $like: `%${searchTerm}%` } : undefined
      }
    });
    return <StigmataList stigmata={stigmata} />;
  } catch (error) {
    console.error('Error fetching stigmata:', error);
    return <div class="text-slate-200">Error fetching stigmata data</div>;
  }
})

const UnderConstruction = ({ page }: { page: string }) => (
  <Layout>
    <>
      <h1 class="text-3xl font-bold mb-4">{page}</h1>
      <p>This page is currently under construction. Please check back later!</p>
    </>
  </Layout>
)

app.get('/valkyries', () => <UnderConstruction page="Valkyries" />)
app.get('/weapons', () => <UnderConstruction page="Weapons" />)
app.get('/astralops-elfs', () => <UnderConstruction page="AstralOps / ELFs" />)
app.get('/about', () => <UnderConstruction page="About" />)

app.listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);