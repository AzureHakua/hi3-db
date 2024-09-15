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
      <body class="bg-slate-900">
        <div class="flex justify-center m-4">
          <input 
            type="text" 
            id="search-input"
            name="search"
            placeholder="Search stigmata..."
            class="max-w-4xl 3xl:max-w-screen-xl w-full p-2 my-2 rounded-md bg-slate-800 text-white"
            hx-trigger="keyup changed delay:500ms"
            hx-get="/stigmata"
            hx-target="#stigmata-list"
          />
        </div>
        <div id="stigmata-list" hx-get='/stigmata' hx-trigger='load'></div>
      </body>
    </html>
  ))
  .get('/stigmata', async ({ query }) => {
    try {
      const searchTerm = query.search || '';
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
  .get('/stigmata/:id/position/:index', async ({ params }) => {
    const stigmata = await getStigmata({ query: { id: Number(params.id) } });
    if (stigmata.length === 0) return 'Stigmata not found';
  
    const stigma = stigmata[0];
    const pos = stigma.positions[Number(params.index)];
  
    return (
      <div>
        {stigma.images && stigma.images.length > 0 && (
          <div class="rounded-none border-2 border-slate-400 overflow-hidden aspect-square mx-10 hidden md:flex">
            <img src={stigma.images.find(img => img.position === pos.position)?.bigUrl ?? ''} alt={`${stigma.name} ${pos.position}`} class="object-cover rounded" />
          </div>
        )}
      </div>
    );
  })
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
