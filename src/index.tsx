import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { cors } from '@elysiajs/cors'
import { tailwind } from '@gtramontina.com/elysia-tailwind'
import { swagger } from '@elysiajs/swagger'
import { staticPlugin } from '@elysiajs/static'
import { stigmataRoutes, getStigmata } from './backend/routes/stigmata'
import { weaponRoutes, getWeapon } from './backend/routes/weapons'
import { StigmataList } from './components/StigmataList'
import { TopNavbar } from './components/Topbar'
import { Sidebar } from './components/Sidebar'
import './styles/tailwind.css'
import { WeaponList } from './components/WeaponList'

// Track sidebar visibility for different screen sizes
let isSidebarVisibleMobile = false;  // Hidden by default on mobile
let isSidebarVisibleDesktop = true;   // Shown by default on desktop

// Create a separate API-only app for Swagger (no prefix since routes already have it)
const apiApp = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: 'Honkai Impact 3rd Database API',
        version: '1.0.0',
        description: 'API for Honkai Impact 3rd game data'
      }
    },
    path: '/swagger'
  }))
  .use(stigmataRoutes)
  .use(weaponRoutes)

// Create the main app without Swagger
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
  .use(staticPlugin())

// Mount the API app
app.mount('/', apiApp)

const Layout = ({ children }: { children: JSX.Element }) => (
  <html lang="en">
    <head>
      <title>Hi~ Elysia</title>
      <link href="/styles/stylesheet.css" rel="stylesheet" />
      <script src="https://unpkg.com/htmx.org@2.0.2"></script>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body class="bg-slate-900 text-slate-300">
      <TopNavbar />
      <div id="sidebar-wrapper" class="fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out w-0 md:w-64 overflow-hidden">
        <Sidebar />
      </div>
      <div class="flex-1 w-full">
        <main class="max-w-4x1 w-full p-20 mx-auto">
          {children}
        </main>
      </div>
    </body>
  </html>
)

app.get('/', () => (
  <Layout>
    <>
      <h1 class="text-3xl font-bold mb-4 text-center">Welcome to Prometheus DB</h1>
      <p class="text-center">A (WIP) database for Honkai Impact 3rd</p>
      <div class="text-center mt-4">
        <a href="/swagger" class="text-blue-400 hover:text-blue-300 underline">
          View API Documentation
        </a>
      </div>
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

app.get('/stigmata/:id/position/:index', async ({ params }) => {
  const stigmata = await getStigmata({ query: { id: Number(params.id) } });
  if (stigmata.length === 0) return 'Stigmata not found';

  const stigma = stigmata[0];
  const pos = stigma.positions[Number(params.index)];

  return (
    <div>
      {stigma.images && stigma.images.length > 0 && (
        <div class="rounded-none border-2 border-slate-400 overflow-hidden aspect-square mx-4 md:mx-10 flex">
          <img src={stigma.images.find(img => img.position === pos.position)?.imgUrl ?? ''}
            alt={`${stigma.name} ${pos.position}`}
            class="object-cover rounded w-full h-full"
            loading="lazy" 
          />
        </div>
      )}
    </div>
  );
})

app.get('/weapons', () => (
  <Layout>
    <>
      <div class="flex justify-center m-4">
        <input
          type="text"
          id="search-input"
          name="search"
          placeholder="Search weapons..."
          class="max-w-4xl 3xl:max-w-screen-xl w-full p-2 my-2 rounded-md bg-slate-800 text-white"
          hx-trigger="keyup changed delay:500ms"
          hx-get="/weapon-list"
          hx-target="#weapon-list"
        />
      </div>
      <div id="weapon-list" hx-get='/weapon-list' hx-trigger='load'></div>
    </>
  </Layout>
))

app.get('/weapon-list', async ({ query }) => {
  try {
    const searchTerm = query.search as string || '';
    const weapons = await getWeapon({
      query: {
        name: searchTerm ? { $like: `%${searchTerm}%` } : undefined
      }
    });
    return <WeaponList weapons={weapons} />;
  } catch (error) {
    console.error('Error fetching weapons:', error);
    return <div class="text-slate-200">Error fetching weapons data</div>;
  }
})

app.post('/toggle-sidebar', ({ headers }) => {
  // Simple detection of mobile vs desktop
  const userAgent = headers['user-agent'] || '';
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(userAgent) || (headers['sec-ch-ua-mobile'] === '?1');
  
  if (isMobile) {
    isSidebarVisibleMobile = !isSidebarVisibleMobile;
    return (
      <div id="sidebar-wrapper" class={`fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out ${isSidebarVisibleMobile ? 'w-64' : 'w-0'} md:w-64 overflow-hidden`}>
        <Sidebar />
      </div>
    );
  } else {
    isSidebarVisibleDesktop = !isSidebarVisibleDesktop;
    return (
      <div id="sidebar-wrapper" class={`fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out w-0 md:${isSidebarVisibleDesktop ? 'w-64' : 'w-0'} overflow-hidden`}>
        <Sidebar />
      </div>
    );
  }
})

const UnderConstruction = ({ page }: { page: string }) => (
  <Layout>
    <>
      <h1 class="text-3xl font-bold mb-4 text-center">{page}</h1>
      <p class="text-center">This page is currently under construction. Please check back later!</p>
    </>
  </Layout>
)

app.get('/valkyries', () => <UnderConstruction page="Valkyries" />)
app.get('/astralops-elfs', () => <UnderConstruction page="AstralOps / ELFs" />)
app.get('/about', () => <UnderConstruction page="About" />)

app.listen(3000)

const hostname = app.server?.hostname || 'localhost';
const port = app.server?.port || 3000;
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

console.log('Static files being served from:', process.cwd() + '/public');
console.log(`🦊 Elysia is running at ${protocol}://${hostname}:${port}`);
console.log(`📚 API Documentation available at: ${protocol}://${hostname}:${port}/swagger`);