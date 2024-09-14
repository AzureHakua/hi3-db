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
  .get('/stigmata/:id/position/:index', async ({ params }) => {
    const stigmata = await getStigmata({ query: { id: Number(params.id) } });
    if (stigmata.length === 0) return 'Stigmata not found';
  
    const stigma = stigmata[0];
    const pos = stigma.positions[Number(params.index)];
  
    return (
      <div>
        {stigma.images && stigma.images.length > 0 && (
          <div class="rounded-full border-2 border-slate-100 overflow-hidden aspect-square mx-20 shadow-[0px_0px_10px_0px_white] hidden md:flex">
            <img src={stigma.images.find(img => img.position === pos.position)?.bigUrl ?? ''} alt={`${stigma.name} ${pos.position}`} class="object-cover rounded" />
          </div>
        )}
        <div class="m-4">
          <p class="font-medium text-lg text-gray-200">{pos.skillName}</p>
          <p class="text-sm text-gray-400 mt-1">{pos.skillDescription}</p>
        </div>
      </div>
    );
  })
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
