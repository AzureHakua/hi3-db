import { Elysia, file } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { cors } from '@elysiajs/cors'
import { tailwind } from '@gtramontina.com/elysia-tailwind'
import { openapi } from '@elysiajs/openapi'
import { staticPlugin } from '@elysiajs/static'
import { stigmataRoutes, getStigmata } from './backend/routes/stigmata'
import { weaponRoutes, getWeapon } from './backend/routes/weapons'
import { StigmataList } from './components/StigmataList'
import { WeaponList } from './components/WeaponList'
import { db } from './backend/db'
import { weapon, stigmata } from './backend/db/schema'
import { sql } from 'drizzle-orm'
import { TopNavbar } from './components/Topbar'
import { Sidebar } from './components/Sidebar'
import './styles/tailwind.css'

// Track sidebar visibility for different screen sizes
let isSidebarVisibleMobile = false;  // Hidden by default on mobile
let isSidebarVisibleDesktop = true;   // Shown by default on desktop

// Create a separate API-only app for Swagger
const apiApp = new Elysia()
  .use(cors())
  .use(openapi({
    documentation: {
      info: {
        title: 'Prometheus Database API',
        version: '1.1.0',
        description: 'An API for Honkai Impact 3rd game data'
      }
    },
    path: '/openapi'
  }))
  .use(stigmataRoutes)
  .use(weaponRoutes)

// Create the main app
const app = new Elysia()
  .use(html())
  .use(cors())
  .use(tailwind({
    path: '/styles/stylesheet.css',
    source: './src/styles/tailwind.css',
    config: './tailwind.config.js',
    options: {
      minify: true,
      map: true,
      autoprefixer: false
    }
  }))
  .use(staticPlugin({
    assets: './public',
    prefix: '/'
  }))
  .get('/favicon.ico', () => file('public/favicon.ico'))
  .get('/img/*', ({ params }) => file(`public/img/${params['*']}`))

// Mount the API app
app.mount('/', apiApp)

// Layout Information
const Layout = ({ children }: { children: JSX.Element }) => (
  <html lang="en">
    <head>
      <title>Prometheus DB</title>
      <link href="/favicon.ico" rel="icon" />
      <link href="/styles/stylesheet.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet" />
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

// Home Page
app.get('/', async () => {
  const [weaponCount, stigmataCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(weapon).get(),
    db.select({ count: sql<number>`count(*)` }).from(stigmata).get(),
  ])

  return (
    <Layout>
      <>
        <h1 class="text-3xl font-bold mb-2 text-center">Welcome to Prometheus DB</h1>
        <div class="flex justify-center mb-4">
          <img src="/img/ui/prom.png" alt="Prometheus DB" class="w-48 h-48 object-contain" />
        </div>
        <p class="text-center text-slate-400 text-lg mb-8">A database for Honkai Impact 3rd</p>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { name: "Valkyries", path: "/valkyries", icon: "/img/ui/valkyries.png" },
            { name: "Weapons", path: "/weapons", icon: "/img/ui/weapons.png" },
            { name: "Stigmata", path: "/stigmata", icon: "/img/ui/stigmata.png" },
            { name: "AstralOps", path: "/astralops-elfs", icon: "/img/ui/astral-ops.png" },
          ].map((card) => (
            <a href={card.path} class="flex flex-col items-center justify-between bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-violet-400 rounded-xl p-4 h-48 transition-all duration-200">
              <img src={card.icon} alt={card.name} class="w-[120px] h-[120px] object-contain p-2" />
              <span class="text-slate-300 font-semibold text-base">{card.name}</span>
            </a>
          ))}
        </div>

        <div class="flex justify-center gap-8 max-w-3xl mx-auto mt-6 bg-slate-700 border border-slate-600 rounded-xl p-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-slate-200">WIP</p>
            <p class="text-slate-400 text-sm">Valkyries</p>
          </div>
          <div class="w-px bg-slate-600"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-slate-200">{weaponCount?.count ?? 0}</p>
            <p class="text-slate-400 text-sm">Weapons</p>
          </div>
          <div class="w-px bg-slate-600"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-slate-200">{stigmataCount?.count ?? 0}</p>
            <p class="text-slate-400 text-sm">Stigmata</p>
          </div>
          <div class="w-px bg-slate-600"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-slate-200">WIP</p>
            <p class="text-slate-400 text-sm">AstralOps</p>
          </div>
        </div>

        <div class="text-center mt-6">
          <a href="/openapi" class="inline-flex items-center gap-2 bg-slate-700 hover:bg-violet-400/60 border border-slate-600 hover:border-violet-400 text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200">
            <i class="ri-file-list-line"></i>
            View API Documentation
          </a>
        </div>
      </>
    </Layout>
  )
})

// Valkyries Page
app.get('/valkyries', () => <UnderConstruction page="Valkyries" />)

// Weapons Page
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

// Stigmata Page
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

app.get('/astralops-elfs', () => <UnderConstruction page="AstralOps" />)

// About Page
app.get('/about', () => (
  <Layout>
    <>
      <h1 class="text-3xl font-bold mb-2 text-center">About</h1>
      <p class="text-center text-slate-400 text-lg mb-8">Prometheus DB</p>

      <div class="max-w-2xl mx-auto space-y-8">

        <div class="bg-slate-700 rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-3">What is Prometheus DB?</h2>
          <p class="text-slate-400 leading-relaxed">Prometheus DB is a fan-made database for Honkai Impact 3rd, providing a searchable reference for weapons, stigmata, valkyries, and more. It is a work in progress and new content is added over time.</p>
        </div>

        <div class="bg-slate-700 rounded-xl p-6">
          <div class="flex gap-6">
            <div class="flex-1">
              <h2 class="text-xl font-semibold mb-3">Honkai Impact 3rd</h2>
              <p class="text-slate-400 leading-relaxed mb-4">Honkai Impact 3rd is an action RPG developed by HoYoverse. All game data and assets belong to HoYoverse.</p>
              <div class="flex flex-wrap gap-3">
                {[
                  { name: "Official Site", url: "https://honkaiimpact3.hoyoverse.com/", icon: "ri-global-line" },
                  { name: "Fandom Wiki", url: "https://honkaiimpact3.fandom.com/", icon: "ri-book-open-line" },
                  { name: "Facebook", url: "https://facebook.com/global.honkaiimpact", icon: "ri-facebook-fill" },
                  { name: "Discord", url: "https://discord.gg/hi3", icon: "ri-discord-fill" },
                  { name: "Twitter", url: "https://twitter.com/HonkaiImpact3rd", icon: "ri-twitter-x-fill" },
                  { name: "Instagram", url: "https://instagram.com/honkaiimpact3rd", icon: "ri-instagram-fill" },
                  { name: "Reddit", url: "https://reddit.com/r/HonkaiImpact3rd", icon: "ri-reddit-fill" },
                ].map((link) => (
                  <a href={link.url} target="_blank" class="flex items-center gap-2 bg-slate-600 hover:bg-violet-400/60 border border-slate-500 hover:border-violet-400 text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200">
                    <i class={link.icon}></i>
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            <div class="hidden md:block flex-shrink-0">
              <img src="/img/ui/hi3-cover.png" alt="Honkai Impact 3rd" class="w-32 rounded-lg object-cover h-full" />
            </div>
          </div>
        </div>

        <div class="bg-slate-700 rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-3">Tech Stack</h2>
          <div class="grid grid-cols-2 gap-3">
            {[
              { name: "Bun", url: "https://bun.sh", desc: "JavaScript runtime", icon: "/img/ui/bun.svg" },
              { name: "ElysiaJS", url: "https://elysiajs.com", desc: "Backend framework", icon: "/img/ui/elysiajs.svg" },
              { name: "Turso", url: "https://turso.tech", desc: "SQLite database", icon: "/img/ui/turso.svg" },
              { name: "Drizzle ORM", url: "https://orm.drizzle.team", desc: "Database ORM", icon: "/img/ui/drizzle-orm.svg" },
              { name: "HTMX", url: "https://htmx.org", desc: "Frontend interactivity", icon: "/img/ui/htmx.svg" },
              { name: "Tailwind CSS", url: "https://tailwindcss.com", desc: "Styling", icon: "/img/ui/tailwind-css.svg" },
            ].map((tech) => (
              <a href={tech.url} target="_blank" class="flex items-center gap-3 bg-slate-600 hover:bg-violet-400/60 border border-slate-500 hover:border-violet-400 rounded-lg p-3 transition-all duration-200">
                <img src={tech.icon} alt={tech.name} class="w-8 h-8 object-contain" />
                <div>
                  <p class="font-semibold text-slate-200">{tech.name}</p>
                  <p class="text-slate-400 text-sm">{tech.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </>
  </Layout>
))

const UnderConstruction = ({ page }: { page: string }) => (
  <Layout>
    <>
      <h1 class="text-3xl font-bold mb-4 text-center">{page}</h1>
      <p class="text-center">This page is currently under construction. Please check back later!</p>
    </>
  </Layout>
)

// Sidebar
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

app.listen(3000)

const hostname = app.server?.hostname || 'localhost';
const port = app.server?.port || 3000;
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

console.log('Static files being served from:', process.cwd() + '/public');
console.log(`🦊 Elysia is running at ${protocol}://${hostname}:${port}`);
console.log(`📚 API Documentation available at: ${protocol}://${hostname}:${port}/swagger`);
