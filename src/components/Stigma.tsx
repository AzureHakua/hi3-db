import { Html } from "@elysiajs/html"
import { SelectStigmata } from "../backend/db/schema"

export function Stigma(props: SelectStigmata) {
  const { id, name, positions, images, setEffects } = props
  const bigImages = images?.filter((img) => img.imgUrl)

  return (
    <div class="overflow-hidden rounded-lg bg-slate-700 shadow-lg">
      <div class="flex flex-col md:grid md:grid-cols-2">
        <div class="mx-4 mt-4">
          <div class="my-3 flex items-center justify-between px-3">
            <hr class="w-full border-slate-600" />
            <div class="mx-auto whitespace-nowrap rounded-full border px-3 py-1 font-semibold text-slate-300">
              {name}
            </div>
            <hr class="w-full border-slate-600" />
          </div>

          <div class="text-slate-300">
            {positions &&
              positions.map((pos) => (
                <div class="m-3 sm:m-4">
                  <p class="text-base font-medium sm:text-lg">{pos.name}</p>
                  <p class="text-sm font-medium">{pos.skillName}</p>
                  <p class="mt-1 text-sm text-slate-400">{pos.skillDescription}</p>
                </div>
              ))}
          </div>
        </div>

        <div class="mx-4 mt-4">
          <div class="grid grid-cols-1 gap-4 whitespace-nowrap">
            <div class="mx-4 mt-2 grid grid-cols-3 gap-2 sm:mx-10 sm:mt-4 sm:gap-4">
              {positions &&
                positions.map((pos, index) => (
                  <div id={`icon-${id}-${index}`} class={positions.length === 1 ? "col-start-2" : ""}>
                    <div
                      data-key={index}
                      class={`relative aspect-[3/1] cursor-pointer rounded-full border-2 transition-all duration-200 ease-in-out ${
                        index === 0
                          ? "border-violet-400 bg-violet-400/30"
                          : "border-slate-400 bg-slate-600 hover:scale-105 hover:border-slate-100"
                      }`}
                      hx-get={`/stigmata/${id}/position/${index}`}
                      hx-target={`#content-container-${id}`}
                      hx-swap="innerHTML transition:true"
                    >
                      <div
                        class={`absolute flex h-full w-full items-center justify-center rounded-full text-sm font-bold sm:text-lg ${
                          index === 0 ? "text-violet-300" : "text-slate-300"
                        }`}
                      >
                        {pos.position}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div id={`content-container-${id}`}>
              {positions &&
                positions.map((pos, index) => (
                  <div id={`content-${id}-${index}`} class={index === 0 ? "" : "hidden"}>
                    {bigImages && bigImages.length > 0 && (
                      <div class="mx-4 flex aspect-square overflow-hidden rounded-none border-2 border-slate-400 sm:mx-10">
                        <img
                          src={bigImages.find((img) => img.position === pos.position)?.imgUrl ?? ""}
                          alt={`${name} ${pos.position}`}
                          class="h-full w-full rounded object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div class="col-span-2 mx-4 mb-4 flex flex-col">
          {setEffects && (setEffects.setName || setEffects.twoPieceEffect || setEffects.threePieceEffect) && (
            <div class="mt-4 border-t border-slate-700 p-3 text-sm text-slate-200 sm:p-4">
              {setEffects.setName && <p class="text-base font-medium sm:text-lg">Set: {setEffects.setName}</p>}
              {setEffects.twoPieceEffect && (
                <>
                  <p class="mt-1 text-slate-300">
                    <span class="font-bold">2-Piece:</span>
                  </p>
                  <p class="mt-1 text-slate-400">{setEffects.twoPieceEffect}</p>
                </>
              )}
              {setEffects.threePieceEffect && (
                <>
                  <p class="mt-1 text-slate-300">
                    <span class="font-bold">3-Piece:</span>
                  </p>
                  <p class="mt-1 text-slate-400">{setEffects.threePieceEffect}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
