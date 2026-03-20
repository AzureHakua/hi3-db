import { Html } from "@elysiajs/html"

export const TopNavbar = () => (
  <nav class="fixed left-0 right-0 top-0 z-50 bg-slate-800 p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <button
          class="mr-4 text-slate-200 transition-all duration-200 hover:scale-110 hover:text-white"
          onclick="toggleSidebar()"
        >
          ☰
        </button>
        <a href="/" class="text-xl font-bold text-white transition-all duration-200 hover:text-violet-400">
          Prometheus DB
        </a>
      </div>
    </div>
  </nav>
)
