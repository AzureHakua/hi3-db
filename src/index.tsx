import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { cors } from '@elysiajs/cors'
import { tailwind } from '@gtramontina.com/elysia-tailwind'
import { swagger } from '@elysiajs/swagger'
import { stigmataRoutes, getStigmata } from './backend/routes/stigmata'
import { StigmataList } from './components/StigmataList'
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
  .get('/', () => (
    <html lang="en">
      <head>
        <title>Hi~ Elysia</title>
        <link href="/styles/stylesheet.css" rel="stylesheet"></link>
        <script src="https://unpkg.com/htmx.org@2.0.2"></script>
      </head>
      <body class="bg-gray-900"
        hx-get='/stigmata'
        hx-trigger='load'
        hx-swap='innerHTML'
      />
    </html>
  ))
  .get('/stigmata', async () => {
    try {
      const stigmata = await getStigmata({ query: {} })
      return <StigmataList stigmata={stigmata} />
    } catch (error) {
      console.error('Error fetching stigmata:', error)
      return <div>Error fetching stigmata data</div>
    }
  })
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
