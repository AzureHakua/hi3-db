import { Html } from "@elysiajs/html"
import { SelectValkyrie } from "../backend/db/schema"

export function Valkyrie(props: SelectValkyrie & { linkable?: boolean }) {
  const {
    id,
    name,
    element,
    type,
    weapon,
    rank,
    character,
    specialization,
    strengths,
    costumes,
    linkable = true,
  } = props
  const baseImage = costumes?.[0]?.imgUrl ?? null

  return (
    <div class="overflow-hidden rounded-lg bg-slate-700 shadow-lg">
      {/* Full-width name header */}
      <div class="mx-4 mt-4 flex items-center px-3">
        <hr class="w-full border-slate-600" />
        {linkable ? (
          <a
            href={`/valkyries/${id}`}
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
          {baseImage && (
            <div class="flex aspect-square w-full overflow-hidden rounded border-2 border-slate-400">
              <img src={`/${baseImage}`} alt={name} class="h-full w-full object-cover" />
            </div>
          )}
        </div>

        {/* Right col: traits */}
        <div class="mx-4 mb-4 mt-3 md:ml-0 md:mt-8">
          <div class="grid grid-cols-2 gap-4 md:mx-4">
            {/* Left traits */}
            <div class="space-y-3">
              <div>
                <p class="text-xs uppercase tracking-wide text-slate-400">Character</p>
                <p class="font-medium text-slate-200">{character?.name}</p>
              </div>
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

            {/* Right traits */}
            <div class="space-y-3 text-right">
              {specialization && (
                <div>
                  <p class="text-xs uppercase tracking-wide text-slate-400">AR Specialization</p>
                  <p class="font-medium text-slate-200">{specialization.spName}</p>
                  {specialization.tags?.map((tag) => (
                    <p class="text-sm text-slate-300">{tag.spTag}</p>
                  ))}
                </div>
              )}
              {(strengths?.length ?? 0) > 0 && (
                <div>
                  <p class="text-xs uppercase tracking-wide text-slate-400">Strengths</p>
                  <div class="mt-1 flex flex-wrap justify-end gap-1">
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
        </div>
      </div>
    </div>
  )
}
