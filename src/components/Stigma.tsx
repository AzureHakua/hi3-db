import { Html } from "@elysiajs/html"
import { SelectStigmata } from "../backend/db/schema"

const ACTIVE_TAB = (i: number) =>
  `flex-1 cursor-default py-1.5 text-center text-sm font-bold bg-violet-400/30 text-violet-300 transition-all duration-200${i > 0 ? " border-l border-slate-400" : ""}`
const INACTIVE_TAB = (i: number) =>
  `flex-1 cursor-pointer py-1.5 text-center text-sm font-bold bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-slate-100 transition-all duration-200${i > 0 ? " border-l border-slate-400" : ""}`

export function Stigma(props: SelectStigmata) {
  const { id, name, positions, images, setEffects } = props
  const bigImages = images?.filter((img) => img.imgUrl)
  const groupId = `stigma-${id}`
  const multi = (positions?.length ?? 0) > 1

  return (
    <div class="overflow-hidden rounded-lg bg-slate-700 shadow-lg">
      {/* Full-width name header */}
      <div class="mx-4 mt-4 flex items-center px-3">
        <hr class="w-full border-slate-600" />
        <div class="mx-auto whitespace-nowrap rounded-full border px-3 py-1 font-semibold text-slate-300">{name}</div>
        <hr class="w-full border-slate-600" />
      </div>

      <div class="flex flex-col md:grid md:grid-cols-2">
        {/* Left col: image + tab buttons */}
        <div class="mx-4 mb-4 mt-3 md:mr-2">
          <div class="relative mx-auto w-full">
            {/* Image panels stacked, opacity switched */}
            <div class="relative aspect-square overflow-hidden rounded-t-lg border-2 border-b-0 border-slate-400">
              {positions?.map((pos, i) => (
                <div data-image={groupId} class={`absolute inset-0 transition-opacity duration-150${i === 0 ? "" : " opacity-0 pointer-events-none"}`}>
                  {bigImages?.find((img) => img.position === pos.position) ? (
                    <img
                      src={bigImages.find((img) => img.position === pos.position)!.imgUrl ?? ""}
                      alt={`${name} ${pos.position}`}
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div class="flex h-full w-full items-center justify-center text-sm text-slate-500">No image</div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom border always present; tabs only if multi-position */}
            {multi ? (
              <div class="flex overflow-hidden rounded-b-lg border-2 border-t-0 border-slate-400">
                {positions?.map((pos, i) => (
                  <div
                    data-tab={groupId}
                    data-active-class={ACTIVE_TAB(i)}
                    data-inactive-class={INACTIVE_TAB(i)}
                    class={i === 0 ? ACTIVE_TAB(i) : INACTIVE_TAB(i)}
                    onclick={`switchImage('${groupId}', ${i})`}
                  >
                    {pos.position}
                  </div>
                ))}
              </div>
            ) : (
              <div class="h-2 rounded-b-lg border-2 border-t-0 border-slate-400"></div>
            )}
          </div>
        </div>

        {/* Right col: skills, vertically centered */}
        <div class="mx-4 gap-4 flex flex-col justify-center md:ml-2">
          {positions?.map((pos) => (
            <div class="rounded-lg bg-slate-600/50 p-3">
              <p class="text-base font-medium text-slate-200">{pos.name}</p>
              <p class="mt-0.5 text-sm font-medium text-slate-300">{pos.skillName}</p>
              <p class="mt-1 text-sm text-slate-400">{pos.skillDescription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Set effects — full width */}
      {setEffects && (setEffects.setName || setEffects.twoPieceEffect || setEffects.threePieceEffect) && (
        <div class="mx-4 mb-4">
          <div class="rounded-lg bg-slate-600/50 p-3">
            {setEffects.setName && <p class="mb-2 text-base font-medium text-slate-200">Set: {setEffects.setName}</p>}
            {setEffects.twoPieceEffect && (
              <div class="mb-2">
                <p class="text-sm font-bold text-slate-300">2-Piece:</p>
                <p class="mt-0.5 text-sm text-slate-400">{setEffects.twoPieceEffect}</p>
              </div>
            )}
            {setEffects.threePieceEffect && (
              <div>
                <p class="text-sm font-bold text-slate-300">3-Piece:</p>
                <p class="mt-0.5 text-sm text-slate-400">{setEffects.threePieceEffect}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
