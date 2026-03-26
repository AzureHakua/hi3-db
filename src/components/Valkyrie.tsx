import { Html } from "@elysiajs/html"
import { SelectValkyrie } from "../backend/db/schema"

const ACTIVE_NODE =
  "flex h-7 w-7 cursor-default items-center justify-center rounded-full border-2 border-violet-400 bg-violet-400/30 text-xs font-bold text-violet-300 transition-all duration-200 md:h-8 md:w-8"
const INACTIVE_NODE =
  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-slate-400 bg-slate-600 text-xs font-bold text-slate-300 transition-all duration-200 hover:scale-105 hover:border-slate-100 md:h-8 md:w-8"

const ACTIVE_TAB = (i: number) =>
  `flex-1 cursor-default py-1.5 text-center text-sm font-bold bg-violet-400/30 text-violet-300 transition-all duration-200${i > 0 ? " border-l border-slate-400" : ""}`
const INACTIVE_TAB = (i: number) =>
  `flex-1 cursor-pointer py-1.5 text-center text-sm font-bold bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-slate-100 transition-all duration-200${i > 0 ? " border-l border-slate-400" : ""}`

const STAR = "★"

const skillCategories = [
  { label: "SP Skill", key: "spSkill" },
  { label: "Astral Ring", key: "astralRing" },
  { label: "Leader", key: "leader" },
  { label: "Passive", key: "passive" },
  { label: "Evasion", key: "evasion" },
  { label: "Basic ATK", key: "basicAtk" },
  { label: "Ultimate", key: "ultimate" },
  { label: "Special Attack", key: "specialAtk" },
  { label: "Weapon Skill", key: "weaponSkill" },
] as const

export function Valkyrie(props: SelectValkyrie & { linkable?: boolean }) {
  const { id, name, element, type, weapon, rank, character, specialization, strengths, skills, costumes, linkable = true } = props

  const costumeGroup = `costume-${id}`
  const nodeGroup = `valk-nodes-${id}`
  const contentGroup = `valk-content-${id}`

  const activeCategories = skillCategories.filter(({ key }) => {
    const s = skills[key as keyof typeof skills]
    return s && s.length > 0
  })

  const allSkills = activeCategories.flatMap(({ key }) =>
    (skills[key as keyof typeof skills] ?? []).map((skill, i) => ({ key, i, skill }))
  )
  const rowCount = Math.ceil(activeCategories.length / 2)

  return (
    <div class="overflow-hidden rounded-lg bg-slate-700 shadow-lg">
      {/* Header */}
      <div class="mx-4 mt-4 flex items-center px-3">
        <hr class="w-full border-slate-600" />
        {linkable ? (
          <a
            href={`/valkyries/${id}`}
            class="mx-auto flex items-baseline gap-2 whitespace-nowrap rounded-full border px-3 py-1 font-semibold text-slate-300 transition-all duration-200"
          >
            <span>{name}</span>
            <span class="text-slate-400">·</span>
            <span>{character.name}</span>
          </a>
        ) : (
          <div class="mx-auto flex items-baseline gap-2 whitespace-nowrap rounded-full border px-3 py-1 font-semibold text-slate-300">
            <span>{name}</span>
            <span class="text-slate-400">·</span>
            <span>{character.name}</span>
          </div>
        )}
        <hr class="w-full border-slate-600" />
      </div>

      <div class="flex flex-col md:grid md:grid-cols-2">
        {/* Left col: image + costume switcher + traits */}
        <div class="mx-4 mb-4 mt-3 justify-center">

          {/* Image with costume switcher */}
          <div class="relative mx-auto w-full">
            <div class="relative aspect-square overflow-hidden rounded-t-lg border-2 border-b-0 border-slate-400">
              {costumes?.map((costume, i) => (
                <div
                  data-image={costumeGroup}
                  class={`absolute inset-0 transition-opacity duration-150 ${i === 0 ? "" : "pointer-events-none opacity-0"}`.trim()}
                >
                  <img
                    src={`/${costume.imgUrl}`}
                    alt={`${name} - ${costume.name}`}
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Costume switcher tabs */}
            {(costumes?.length ?? 0) > 1 ? (
              <div class="flex overflow-hidden rounded-b-lg border-2 border-t-0 border-slate-400">
                {costumes?.map((costume, i) => (
                  <div
                    data-tab={costumeGroup}
                    data-active-class={ACTIVE_TAB(i)}
                    data-inactive-class={INACTIVE_TAB(i)}
                    class={i === 0 ? ACTIVE_TAB(i) : INACTIVE_TAB(i)}
                    onclick={`switchImage('${costumeGroup}', ${i})`}
                  >
                    {STAR.repeat(costume.rarity)}
                  </div>
                ))}
              </div>
            ) : (
              <div class="h-2 rounded-b-lg border-2 border-t-0 border-slate-400"></div>
            )}
          </div>

          {/* Traits */}
          <div class="mt-4 space-y-2 text-center">
            <div class="grid grid-cols-4 gap-2">
              <div>
                <p class="text-xs uppercase tracking-wide text-slate-400">Rank</p>
                <p class="font-medium text-slate-200">{rank}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wide text-slate-400">Type</p>
                <p class="font-medium text-slate-200">{type}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wide text-slate-400">Element</p>
                <p class="font-medium text-slate-200">{element}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wide text-slate-400">Weapon</p>
                <p class="font-medium text-slate-200">{weapon}</p>
              </div>
            </div>

            {specialization && (
              <div>
                <p class="text-xs uppercase tracking-wide text-slate-400">AR Specialization</p>
                <p class="font-medium text-slate-200">{specialization.spName}</p>
                <div class="mt-1 flex flex-wrap gap-1">
                  {specialization.tags?.map((tag) => (
                    <span class="rounded border border-slate-500 bg-slate-600/50 px-2 py-0.5 text-xs text-slate-300">
                      {tag.spTag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(strengths?.length ?? 0) > 0 && (
              <div>
                <p class="text-xs mt-4 uppercase tracking-wide text-slate-400">Strengths</p>
                <div class="mt-1 flex flex-wrap justify-center gap-1">
                  {strengths.map((s) => (
                    <span class="rounded border border-slate-500 bg-slate-600/50 px-2 py-0.5 text-xs text-slate-300">
                      {s.strength}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right col: skill swapper */}
        <div class="mx-4 mb-4 mt-3 md:ml-0 md:mt-8">
          <div class="mb-4 md:mx-4">
            {/* Node rows */}
            <div class={`grid grid-flow-col gap-x-4 gap-y-3`} style={`grid-template-rows: repeat(${rowCount}, auto)`}>
              {activeCategories.map(({ label, key }) => {
                const catSkills = skills[key as keyof typeof skills] ?? []
                if (!catSkills.length) return <></>
                return (
                  <div>
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
                  {skill.unlock !== "Default" && (
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
