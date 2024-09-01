import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { stigmataRoutes, getStigmata } from './backend/routes/stigmata'
import { StigmataList } from './components/StigmataList'

const app = new Elysia()
  .use(html())
  .use(cors())
  .use(swagger())
  .use(stigmataRoutes)
  .get('/', () => (
    <html lang="en">
      <head>
        <title>Hi~ Elysia</title>
        <script src="https://unpkg.com/htmx.org@2.0.2"></script>
      </head>
      <body
        hx-get='/api/stigmata'
        hx-trigger='load'
        hx-swap='innerHTML'
      />
    </html>
  ))
  .get('/stigmata-list', async () => {
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