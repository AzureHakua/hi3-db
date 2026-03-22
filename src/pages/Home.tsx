import { Html } from "@elysiajs/html"
import { Layout } from "../layout"
import { getEntityCounts } from "../backend/db/counts"

export const homePage = async () => {
  // Gets database counts to display on homepage
  const { weaponCount, stigmataCount, astralOpCount } = await getEntityCounts()

  return (
    <Layout>
      <>
        <h1 class="mb-2 text-center text-2xl font-bold sm:text-3xl">Welcome to Prometheus DB</h1>
        <div class="mb-3 flex justify-center">
          <img src="/img/ui/prom.png" alt="Prometheus DB" class="h-28 w-28 object-contain sm:h-48 sm:w-48" />
        </div>
        <p class="mb-6 text-center text-sm text-slate-400 sm:text-lg">A database for Honkai Impact 3rd</p>

        {/* Main icon grid */}
        <div class="mx-auto grid max-w-3xl grid-cols-4 gap-2 sm:gap-4">
          {[
            {
              name: "Valkyries",
              path: "/valkyries",
              icon: "/img/ui/valkyries.png",
            },
            {
              name: "Weapons",
              path: "/weapons",
              icon: "/img/ui/weapons.png",
            },
            {
              name: "Stigmata",
              path: "/stigmata",
              icon: "/img/ui/stigmata.png",
            },
            {
              name: "AstralOps",
              path: "/astralops",
              icon: "/img/ui/astral-ops.png",
            },
          ].map((card) => (
            <a
              href={card.path}
              class="flex flex-col items-center justify-between rounded-xl border border-slate-600 bg-slate-700 p-2 transition-all duration-200 hover:border-violet-400 hover:bg-slate-600 sm:p-4"
            >
              <img src={card.icon} alt={card.name} class="h-12 w-12 object-contain sm:h-20 sm:w-20 sm:p-1" />
              <span class="mt-1 text-center text-xs font-semibold text-slate-300 sm:text-sm">{card.name}</span>
            </a>
          ))}
        </div>

        <div class="mx-auto mt-4 flex max-w-3xl justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-2 py-3 sm:mt-6 sm:gap-8 sm:px-4 sm:py-4">
          <div class="text-center">
            <p class="text-base font-bold text-slate-200 sm:text-2xl">WIP</p>
            <p class="text-sm text-slate-400">Valkyries</p>
          </div>
          <div class="w-px bg-slate-600"></div>
          <div class="text-center">
            <p class="text-base font-bold text-slate-200 sm:text-2xl">{weaponCount?.count ?? 0}</p>
            <p class="text-sm text-slate-400">Weapons</p>
          </div>
          <div class="w-px bg-slate-600"></div>
          <div class="text-center">
            <p class="text-base font-bold text-slate-200 sm:text-2xl">{stigmataCount?.count ?? 0}</p>
            <p class="text-sm text-slate-400">Stigmata</p>
          </div>
          <div class="w-px bg-slate-600"></div>
          <div class="text-center">
            <p class="text-base font-bold text-slate-200 sm:text-2xl">{astralOpCount?.count ?? 0}</p>
            <p class="text-sm text-slate-400">AstralOps</p>
          </div>
        </div>

        <div class="mt-4 text-center sm:mt-6">
          <a
            href="/openapi"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-violet-400 hover:bg-violet-400/60 hover:text-white"
          >
            <i class="ri-file-list-line"></i>
            View API Documentation
          </a>
        </div>
      </>
    </Layout>
  )
}
