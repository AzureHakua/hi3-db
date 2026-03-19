import { Html } from '@elysiajs/html'
import { SelectAstralOp } from '../backend/db/schema'

export function AstralOp(props: SelectAstralOp) {
  const { id, name, imgUrl, damage, specializations, skills } = props;
  const { synergy, recharge, passive } = skills;

  const categoryMap: { label: string, key: string, skills: typeof synergy }[] = [
    { label: 'Synergy ATK', key: 'synergy', skills: synergy },
    { label: 'Recharge Skill', key: 'recharge', skills: recharge },
    { label: 'Passive Skill', key: 'passive', skills: passive },
  ]

  // First skill across all categories for auto-select
  const firstSkill = synergy?.[0];

  return (
    <div class="bg-slate-700 shadow-lg rounded-lg overflow-hidden">
      <div class="flex flex-col md:grid md:grid-cols-2">

        <div class="mx-4 mt-4 mb-4 flex flex-col">

          <div class="flex items-center justify-between my-3 px-3">
            <hr class="w-full border-slate-600"></hr>
            <div class="font-semibold rounded-full border text-slate-300 py-1 px-3 mx-auto whitespace-nowrap">{name}</div>
            <hr class="w-full border-slate-600"></hr>
          </div>

          <div class="flex mt-2 justify-center flex-1">
            {imgUrl && (
              <div class="rounded-none border-2 border-slate-400 overflow-hidden aspect-square mx-4 md:mx-10 flex">
                <img src={imgUrl} alt={name} class="object-cover rounded w-full h-full" loading="lazy" />
              </div>
            )}
          </div>

          <div class="mt-2 mb-4 text-center">
            <span class="bg-slate-800/80 text-slate-400 text-xs px-3 py-1.5 rounded border border-slate-600 font-mono">
              ID: {String(id).padStart(3, '0')}
            </span>
          </div>

        </div>

        <div class="mx-4 mt-8 mb-4">

          {/* Top row: node grid left, traits right */}
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              {categoryMap.map(({ label, key, skills: categorySkills }) => {
                if (!categorySkills || categorySkills.length === 0) return <></>;
                return (
                  <div class="mb-3">
                    <p class="text-slate-400 text-xs mb-2">{label}</p>
                    <div class="flex items-center gap-1">
                      {categorySkills.map((skill: typeof synergy[0], index: number) => (
                        <>
                          <button
                            id={`skill-node-${id}-${key}-${index}`}
                            class={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer
                              ${key === 'synergy' && index === 0
                                ? 'border-violet-400 bg-violet-400/30 text-violet-300'
                                : 'border-slate-400 bg-slate-600 text-slate-300 hover:scale-105 hover:border-slate-100'
                              }`}
                            hx-get={`/astralop/${id}/skill/${key}/${index}`}
                            hx-target={`#skill-content-${id}`}
                            hx-swap="innerHTML transition:true"
                          >
                            {index + 1}
                          </button>
                          {index < categorySkills.length - 1 && (
                            <div class="w-4 h-px bg-slate-500"></div>
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div class="text-right mt-10 mr-4">
              <p class="text-slate-400 text-xs uppercase tracking-wide mb-1">Damage Type</p>
              <p class="text-slate-200 font-medium capitalize mb-3">{damage}</p>
              {specializations && specializations.length > 0 && (
                <div>
                  <p class="text-slate-400 text-xs uppercase tracking-wide mb-1">AR Specialization</p>
                  {specializations.map((sp) => (
                    <div>
                      <p class="font-medium">{sp.spName}</p>
                      <p class="text-slate-300 font-medium text-sm">{sp.spTag}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full width skill content below */}
          <div id={`skill-content-${id}`} class="p-3 mr-4 bg-slate-600/50 rounded-lg min-h-[100px]">
            {firstSkill && (
              <>
                <div class="flex items-center gap-2 mb-2">
                  <p class="text-slate-200 font-medium">{firstSkill.skillName}</p>
                  {firstSkill.unlock !== 'S' && (
                    <span class="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
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
