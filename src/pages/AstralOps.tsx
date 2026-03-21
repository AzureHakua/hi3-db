import { Html } from "@elysiajs/html"
import { Layout } from "../layout"
import { SearchBar } from "../components/SearchBar"
import { AstralOpList } from "../components"
import { getAstralOp } from "../backend/routes"

export const astralOpsPage = () => (
  <Layout>
    <>
      <h1 class="mb-2 text-center text-3xl font-bold">AstralOps</h1>
      <SearchBar placeholder="Search AstralOps..." target="astralops-list" endpoint="/astralops-list" />
      <div
        id="astralops-list"
        hx-get="/astralops-list"
        hx-trigger="load"
        hx-target="#astralops-list"
        hx-swap="innerHTML transition:true"
      ></div>
    </>
  </Layout>
)

export const astralOpsListPage = async ({ query }: { query: { search?: string } }) => {
  try {
    const searchTerm = query.search ?? ""
    const astralOps = await getAstralOp({
      query: {
        name: searchTerm ? { $like: `%${searchTerm}%` } : undefined,
      },
    })
    return <AstralOpList astralOps={astralOps} />
  } catch (error) {
    console.error("Error fetching astralops:", error)
    return <div class="text-slate-200">Error fetching AstralOps data</div>
  }
}

export const astralOpSkillPage = async ({ params }: { params: { id: number; category: string; index: number } }) => {
  const astralOps = await getAstralOp({ query: { id: params.id } })
  if (astralOps.length === 0) return "AstralOp not found"

  const astralOp = astralOps[0]
  const { synergy, recharge, passive } = astralOp.skills
  const categorySkills = astralOp.skills[params.category as keyof typeof astralOp.skills]
  const skill = categorySkills?.[params.index]

  if (!skill) return "Skill not found"

  const categoryMap = [
    { key: "synergy", skills: synergy },
    { key: "recharge", skills: recharge },
    { key: "passive", skills: passive },
  ]

  return (
    <>
      {categoryMap.map(({ key, skills: catSkills }) =>
        catSkills?.map((_: (typeof synergy)[0], i: number) => (
          <div id={`skill-node-${astralOp.id}-${key}-${i}`} hx-swap-oob="outerHTML">
            <button
              id={`skill-node-${astralOp.id}-${key}-${i}`}
              class={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 ${
                key === params.category && i === params.index
                  ? "border-violet-400 bg-violet-400/30 text-violet-300"
                  : "border-slate-400 bg-slate-600 text-slate-300 hover:scale-105 hover:border-slate-100"
              }`}
              hx-get={`/astralop/${astralOp.id}/skill/${key}/${i}`}
              hx-target={`#skill-content-${astralOp.id}`}
              hx-swap="innerHTML transition:true"
            >
              {i + 1}
            </button>
          </div>
        )),
      )}
      <div class="mb-2 flex items-center gap-2">
        <p class="font-medium text-slate-200">{skill.skillName}</p>
        {skill.unlock !== "S" && (
          <span class="rounded border border-amber-500/40 bg-amber-500/20 px-1.5 py-0.5 text-xs font-bold text-amber-400">
            {skill.unlock}
          </span>
        )}
      </div>
      <p class="text-sm text-slate-400">{skill.skillDescription}</p>
    </>
  )
}
