import { Html } from "@elysiajs/html"
import { SelectAstralOp } from "../backend/db/schema"

const ACTIVE_NODE =
  "flex h-7 w-7 cursor-default items-center justify-center rounded-full border-2 border-violet-400 bg-violet-400/30 text-xs font-bold text-violet-300 transition-all duration-200 md:h-8 md:w-8"
const INACTIVE_NODE =
  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-slate-400 bg-slate-600 text-xs font-bold text-slate-300 transition-all duration-200 hover:scale-105 hover:border-slate-100 md:h-8 md:w-8"

export function AstralOp(props: SelectAstralOp & { linkable?: boolean }) {
  const { id, name, imgUrl, element, specializations, skills, linkable = true } = props
  const { synergy, recharge, passive } = skills

  const categories = [
    { label: "Synergy ATK", key: "synergy", skills: synergy },
    { label: "Recharge Skill", key: "recharge", skills: recharge },
    { label: "Passive Skill", key: "passive", skills: passive },
  ] as const

  const allSkills = categories.flatMap(({ key, skills: s }) => (s ?? []).map((skill, i) => ({ key, i, skill })))

  const nodeGroup = `aop-nodes-${id}`
  const contentGroup = `aop-content-${id}`

  return (
    <div class="overflow-hidden rounded-lg bg-slate-700 shadow-lg">
      {/* Full-width name header */}
      <div class="mx-4 mt-4 flex items-center px-3">
        <hr class="w-full border-slate-600" />
        {linkable ? (
          <a
            href={`/astralops/${id}`}
            class="mx-auto whitespace-nowrap rounded-full border px-3 py-1 font-semibold text-slate-300 transition-all duration-200"
          >
            {name}
          </a>
        ) : (
          <div class="mx-auto whitespace-nowrap rounded-full border px-3 py-1 font-semibold text-slate-300">{name}</div>
        )}
        <hr class="w-full border-slate-600" />
      </div>

      <div class="flex flex-col md:grid md:grid-cols-2">
        {/* Left col: image */}
        <div class="mx-4 mb-4 mt-3 flex justify-center self-start">
          {imgUrl && (
            <div class="flex aspect-square w-full overflow-hidden rounded border-2 border-slate-400">
              <img src={`/${imgUrl}`} alt={name} class="h-full w-full object-cover" />
            </div>
          )}
        </div>

        {/* Right col: nodes + traits + skill content */}
        <div class="mx-4 mb-4 mt-3 md:ml-0 md:mt-8">
          <div class="mb-4 grid grid-cols-2 md:mx-4">
            {/* Node rows */}
            <div>
              {categories.map(({ label, key, skills: catSkills }) => {
                if (!catSkills?.length) return <></>
                return (
                  <div class="mb-3">
                    <p class="mb-2 text-xs text-slate-400">{label}</p>
                    <div class="flex items-center gap-1">
                      {catSkills.map((_, i) => {
                        const panelIndex = allSkills.findIndex((s) => s.key === key && s.i === i)
                        return (
                          <>
                            <button
                              data-tab={nodeGroup}
                              data-active-class={ACTIVE_NODE}
                              data-inactive-class={INACTIVE_NODE}
                              class={panelIndex === 0 ? ACTIVE_NODE : INACTIVE_NODE}
                              onclick={`switchTab('${nodeGroup}', ${panelIndex}); switchTab('${contentGroup}', ${panelIndex})`}
                            >
                              {i + 1}
                            </button>
                            {i < catSkills.length - 1 && <div class="h-px w-2 bg-slate-500 md:w-4"></div>}
                          </>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Traits */}
            <div class="mt-4 text-right">
              <p class="mb-1 text-xs uppercase tracking-wide text-slate-400">Element Type</p>
              <p class="mb-3 font-medium capitalize text-slate-200">{element}</p>
              {(specializations?.length ?? 0) > 0 && (
                <div>
                  <p class="mb-1 text-xs uppercase tracking-wide text-slate-400">AR Specialization</p>
                  {specializations.map((sp) => (
                    <div>
                      <p class="font-medium">{sp.spName}</p>
                      <p class="text-sm font-medium text-slate-300">{sp.spTag}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skill panels */}
          <div class="relative">
            {allSkills.map(({ skill }, panelIndex) => (
              <div
                data-panel={contentGroup}
                class={`rounded-lg bg-slate-600/50 p-3 transition-opacity duration-150 ${panelIndex === 0 ? "" : "hidden"}`.trim()}
              >
                <div class="mb-2 flex items-center gap-2">
                  <p class="font-medium text-slate-200">{skill.skillName}</p>
                  {skill.unlock !== "S" && (
                    <span class="rounded border border-amber-500/40 bg-amber-500/20 px-1.5 py-0.5 text-xs font-bold text-amber-400">
                      {skill.unlock}
                    </span>
                  )}
                </div>
                <p class="text-sm text-slate-400">{skill.skillDescription}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
