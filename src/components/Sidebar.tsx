import { Html } from '@elysiajs/html'

export const Sidebar = () => (
  <div id="sidebar-wrapper" class="relative w-0 lg:w-64">
    <aside id="sidebar" class="fixed bg-slate-800 h-screen p-4 overflow-y-auto z-40 transition-transform duration-300 ease-in-out transform -translate-x-full lg:translate-x-0">
      <div class="text-2xl font-bold mx-2 my-4 text-center">Prometheus DB</div>
      <nav>
        <ul class="space-y-2">
          {[
            { name: "Home", path: "/" },
            { name: "Valkyries", path: "/valkyries" },
            { name: "Weapons", path: "/weapons" },
            { name: "Stigmata", path: "/stigmata" },
            { name: "AstralOps / ELFs", path: "/astralops-elfs" },
            { name: "About", path: "/about" }
          ].map(item => (
            <li>
              <a 
                href={item.path}
                class="block px-4 py-2 rounded-md transition-all font-semibold hover:bg-violet-400/60"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  </div>
)