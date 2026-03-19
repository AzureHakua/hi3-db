import { Html } from '@elysiajs/html'

export const TopNavbar = () => (
  <nav class="bg-slate-800 p-4 fixed top-0 left-0 right-0 z-50">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <button 
          class="text-slate-200 hover:text-white hover:scale-110 transition-all duration-200 mr-4"
          onclick="toggleSidebar()"
        >
          ☰
        </button>
        <a href="/" class="text-white text-xl font-bold hover:text-violet-400 transition-all duration-200">Prometheus DB</a>
      </div>
    </div>
  </nav>
)
