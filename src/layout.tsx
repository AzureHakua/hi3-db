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
      <TopNavbar />
      <div
        id="sidebar-wrapper"
        class="fixed left-0 top-0 h-screen w-0 overflow-hidden transition-all duration-300 ease-in-out md:w-64"
      >
        <Sidebar />
      </div>
      <script>{`
        const sidebar = document.getElementById('sidebar-wrapper');
        const mq = window.matchMedia('(min-width: 1500px)');
        
        function toggleSidebar() {
          const isOpen = sidebar.style.width === '16rem';
          sidebar.style.width = isOpen ? '0' : '16rem';
        }

        function updateSidebar(e) {
          sidebar.style.width = e.matches ? '16rem' : '0';
        }
        
        mq.addEventListener('change', updateSidebar);
        updateSidebar(mq);
      `}</script>
      <div class="w-full flex-1">
        <main class="max-w-4x1 mx-auto w-full p-20">{children}</main>
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
