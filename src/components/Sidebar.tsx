import { Html } from '@elysiajs/html'

export const Sidebar = () => (
  <aside id="sidebar" class="absolute top-0 left-0 pt-16 px-4 w-full h-full bg-slate-800 overflow-y-auto z-40 overflow-hidden">
      <nav>
        <ul class="space-y-2 text-center">
          {[
            { name: "Home", path: "/" },
            { name: "Valkyries", path: "/valkyries" },
            { name: "Weapons", path: "/weapons" },
            { name: "Stigmata", path: "/stigmata" },
            { name: "AstralOps", path: "/astralops" },
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
)
