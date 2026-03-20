import { Html } from "@elysiajs/html"

export const Sidebar = () => (
  <aside
    id="sidebar"
    class="absolute left-0 top-0 z-40 h-full w-full overflow-hidden overflow-y-auto bg-slate-800 px-4 pt-16"
  >
    <nav>
      <ul class="space-y-2 text-center">
        {[
          { name: "Home", path: "/" },
          { name: "Valkyries", path: "/valkyries" },
          { name: "Weapons", path: "/weapons" },
          { name: "Stigmata", path: "/stigmata" },
          { name: "AstralOps", path: "/astralops" },
          { name: "About", path: "/about" },
        ].map((item) => (
          <li>
            <a href={item.path} class="block rounded-md px-4 py-2 font-semibold transition-all hover:bg-violet-400/60">
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
)
