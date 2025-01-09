import { Html } from '@elysiajs/html'

export const TopNavbar = () => (
  <nav class="bg-slate-800 p-4 fixed top-0 left-0 right-0 z-50">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <button 
          class="text-white mr-4"
          hx-post="/toggle-sidebar"
          hx-target="#sidebar-wrapper"
          hx-swap="outerHTML"
        >
          ☰
        </button>
        <a href="/" class="text-white text-xl font-bold">Prometheus DB</a>
      </div>
    </div>
  </nav>
)
