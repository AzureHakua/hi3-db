import { Html } from "@elysiajs/html"
import { Layout } from "../layout"
import { getEntityCounts } from "../backend/db/counts"

export const homePage = async () => {
  // Gets database counts to display on homepage
  const { weaponCount, stigmataCount, astralOpCount } = await getEntityCounts()

  return (
    <Layout>
      <>
        <h1 class="mb-2 text-center text-3xl font-bold">Welcome to Prometheus DB</h1>
        <div class="mb-4 flex justify-center">
          <img src="/img/ui/prom.png" alt="Prometheus DB" class="h-48 w-48 object-contain" />
        </div>
        <p class="mb-8 text-center text-lg text-slate-400">A database for Honkai Impact 3rd</p>

        {/* Main icon grid */}
        <div class="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
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
              class="flex h-48 flex-col items-center justify-between rounded-xl border border-slate-600 bg-slate-700 p-4 transition-all duration-200 hover:border-violet-400 hover:bg-slate-600"
            >
              <img src={card.icon} alt={card.name} class="h-[120px] w-[120px] object-contain p-2" />
              <span class="text-base font-semibold text-slate-300">{card.name}</span>
            </a>
          ))}
        </div>

        <div class="mx-auto mt-6 flex max-w-3xl justify-center gap-8 rounded-xl border border-slate-600 bg-slate-700 p-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-slate-200">WIP</p>
            <p class="text-sm text-slate-400">Valkyries</p>
          </div>
          <div class="w-px bg-slate-600"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-slate-200">{weaponCount?.count ?? 0}</p>
            <p class="text-sm text-slate-400">Weapons</p>
          </div>
          <div class="w-px bg-slate-600"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-slate-200">{stigmataCount?.count ?? 0}</p>
            <p class="text-sm text-slate-400">Stigmata</p>
          </div>
          <div class="w-px bg-slate-600"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-slate-200">{astralOpCount?.count ?? 0}</p>
            <p class="text-sm text-slate-400">AstralOps</p>
          </div>
        </div>

        <div class="mt-6 text-center">
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
