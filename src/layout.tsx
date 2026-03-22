import { Html } from "@elysiajs/html"
import { TopNavbar } from "./components"
import { Sidebar } from "./components"

export const Layout = ({ children }: { children: JSX.Element }) => (
  <html lang="en">
    <head>
      <title>Prometheus DB</title>
      <link href="/favicon.ico" rel="icon" />
      <link href="/styles/stylesheet.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet" />
      <script src="/js/htmx.min.js"></script>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body class="bg-slate-900 text-slate-300">
      <div class="fixed left-0 right-0 top-0 z-50 h-16 -translate-y-full bg-slate-800"></div>
      <TopNavbar />

      <div id="sidebar-overlay" class="fixed inset-0 z-40 hidden bg-transparent" onclick="toggleSidebar()"></div>

      <div
        id="sidebar-wrapper"
        class="fixed left-0 top-0 z-50 h-screen w-0 overflow-hidden transition-all duration-300 ease-in-out md:w-64"
      >
        <Sidebar />
      </div>
      <script>{`
        const sidebar = document.getElementById('sidebar-wrapper');
        const overlay = document.getElementById('sidebar-overlay');
        const mq = window.matchMedia('(min-width: 1500px)');
        
        function toggleSidebar() {
          const isOpen = sidebar.style.width === '12rem';
          sidebar.style.width = isOpen ? '0' : '12rem';
          overlay.classList.toggle('hidden', isOpen);
        }

        function updateSidebar(e) {
          sidebar.style.width = e.matches ? '12rem' : '0';
          overlay.classList.add('hidden');
        }
        
        mq.addEventListener('change', updateSidebar);
        updateSidebar(mq);
      `}</script>
      <div class="w-full flex-1">
        <main class="mx-auto w-full px-4 pb-8 pt-20 sm:px-6 md:px-10 lg:px-20">{children}</main>
      </div>
    </body>
  </html>
)

export const UnderConstruction = ({ page }: { page: string }) => (
  <Layout>
    <>
      <h1 class="mb-4 text-center text-3xl font-bold">{page}</h1>
      <p class="text-center">This page is currently under construction. Please check back later!</p>
    </>
  </Layout>
)
