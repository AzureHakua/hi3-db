import { Html } from "@elysiajs/html"
import { SelectAstralOp } from "../backend/db/schema"

export function AstralOp(props: SelectAstralOp) {
  const { id, name, imgUrl, damage, specializations, skills } = props
  const { synergy, recharge, passive } = skills

  const categoryMap: { label: string; key: string; skills: typeof synergy }[] = [
    { label: "Synergy ATK", key: "synergy", skills: synergy },
    { label: "Recharge Skill", key: "recharge", skills: recharge },
    { label: "Passive Skill", key: "passive", skills: passive },
  ]

  // First skill across all categories for auto-select
  const firstSkill = synergy?.[0]

  return (
    <div class="overflow-hidden rounded-lg bg-slate-700 shadow-lg">
      <div class="flex flex-col md:grid md:grid-cols-2">
        <div class="mx-4 mb-4 mt-4 flex flex-col">
          <div class="my-3 flex items-center justify-between px-3">
            <hr class="w-full border-slate-600"></hr>
            <div class="mx-auto whitespace-nowrap rounded-full border px-3 py-1 font-semibold text-slate-300">
              {name}
            </div>
            <hr class="w-full border-slate-600"></hr>
          </div>

          <div class="mt-2 flex flex-1 justify-center">
            {imgUrl && (
              <div class="mx-4 flex aspect-square overflow-hidden rounded-none border-2 border-slate-400 md:mx-10">
                <img src={imgUrl} alt={name} class="h-full w-full rounded object-cover" loading="lazy" />
              </div>
            )}
          </div>

          <div class="mb-4 mt-2 text-center">
            <span class="rounded border border-slate-600 bg-slate-800/80 px-3 py-1.5 font-mono text-xs text-slate-400">
              ID: {String(id).padStart(3, "0")}
            </span>
          </div>
        </div>

        <div class="mx-4 mb-4 mt-4 md:mt-8">
          {/* Top row: node grid left, traits right */}
          <div class="mb-4 grid grid-cols-2 gap-2 md:gap-4">
            <div>
              {categoryMap.map(({ label, key, skills: categorySkills }) => {
                if (!categorySkills || categorySkills.length === 0) return <></>
                return (
                  <div class="mb-3">
                    <p class="mb-2 text-xs text-slate-400">{label}</p>
                    <div class="flex items-center gap-1">
                      {categorySkills.map((skill: (typeof synergy)[0], index: number) => (
                        <>
                          <button
                            id={`skill-node-${id}-${key}-${index}`}
                            class={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 md:h-8 md:w-8 ${
                              key === "synergy" && index === 0
                                ? "border-violet-400 bg-violet-400/30 text-violet-300"
                                : "border-slate-400 bg-slate-600 text-slate-300 hover:scale-105 hover:border-slate-100"
                            }`}
                            hx-get={`/astralop/${id}/skill/${key}/${index}`}
                            hx-target={`#skill-content-${id}`}
                            hx-swap="innerHTML transition:true"
                          >
                            {index + 1}
                          </button>
                          {index < categorySkills.length - 1 && <div class="h-px w-2 bg-slate-500 md:w-4"></div>}
                        </>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div class="mr-4 mt-4 text-right md:mt-10">
              <p class="mb-1 text-xs uppercase tracking-wide text-slate-400">Damage Type</p>
              <p class="mb-3 font-medium capitalize text-slate-200">{damage}</p>
              {specializations && specializations.length > 0 && (
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

          {/* Full width skill content below */}
          <div id={`skill-content-${id}`} class="min-h-[100px] rounded-lg bg-slate-600/50 p-3">
            {firstSkill && (
              <>
                <div class="mb-2 flex items-center gap-2">
                  <p class="font-medium text-slate-200">{firstSkill.skillName}</p>
                  {firstSkill.unlock !== "S" && (
                    <span class="rounded border border-amber-500/40 bg-amber-500/20 px-1.5 py-0.5 text-xs font-bold text-amber-400">
                      {firstSkill.unlock}
                    </span>
                  )}
                </div>
                <p class="text-sm text-slate-400">{firstSkill.skillDescription}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
