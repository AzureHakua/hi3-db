import { html, Html } from '@elysiajs/html'
import { SelectStigmata } from '../backend/db/schema'

export function Stigma(props: SelectStigmata) {
  const { id, name, positions, images, setEffects } = props;
  const bigImages = images?.filter(img => img.imgUrl);

  return (
    <div class="bg-slate-700 shadow-lg rounded-lg overflow-hidden">
      <div class="flex flex-col md:grid md:grid-cols-2">
        
        <div class="mx-4 mt-4">
          
          <div class="flex items-center justify-between my-3 px-3">
            <hr class="w-full border-slate-600"></hr>
            <div class="font-semibold rounded-full border text-slate-300 py-1 px-3 mx-auto whitespace-nowrap">{name}</div>
            <hr class="w-full border-slate-600"></hr>
          </div>

          <div class="text-slate-300">
            {positions && positions.map((pos) => (
              <div class="m-4">
                <p class="font-medium text-lg">{pos.name}</p>
                <p class="font-medium text-md">{pos.skillName}</p>
                <p class="text-sm text-slate-400 mt-1">{pos.skillDescription}</p>
              </div>
            ))}
          </div>

        </div>


        <div class="mx-4 mt-4">

          <div class="grid grid-cols-1 gap-4 whitespace-nowrap">
            <div class="grid grid-cols-3 gap-4 mt-4 mx-10">
              {positions && positions.map((pos, index) => (
                <div data-key={index} class={`${positions.length === 1 ? 'col-start-2' : ''} relative rounded-full aspect-[3/1] border-2 border-slate-400 hover:scale-105 hover:border-slate-100 transition-all duration-[0.25] ease-[ease-in-out] cursor-pointer`}
                  id={`icon-${id}-${index}`}
                  hx-get={`/stigmata/${props.id}/position/${index}`}
                  hx-target={`#content-container-${id}`}
                  hx-swap="innerHTML">
                  <div class="bg-slate-300 text-indigo-700 text-lg font-bold rounded-full absolute w-full h-full flex items-center justify-center">{pos.position}</div>
                </div>
              ))}
            </div>
            

            <div id={`content-container-${id}`}>
              {positions && positions.map((pos, index) => (
                <div id={`content-${id}-${index}`} class={index === 0 ? '' : 'hidden'}>
                  {bigImages && bigImages.length > 0 && (
                    <div class="rounded-none border-2 border-slate-400 overflow-hidden aspect-square mx-10 hidden md:flex">
                      <img src={bigImages.find(img => img.position === pos.position)?.imgUrl ?? ''}
                        alt={`${name} ${pos.position}`}
                        class="object-cover rounded"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>


        <div class="flex flex-col col-span-2 mx-4 mb-4">
          {setEffects && (setEffects.setName || setEffects.twoPieceEffect || setEffects.threePieceEffect) && (
            <div class="text-sm border-t border-slate-700 text-slate-200 mt-4 p-4">
              {setEffects.setName && <p class="font-medium text-lg">Set: {setEffects.setName}</p>}
              {setEffects.twoPieceEffect && (
                <>
                  <p class="mt-1 text-slate-300"><span class="font-bold">2-Piece:</span></p>
                  <p class="mt-1 text-slate-400">{setEffects.twoPieceEffect}</p>
                </>
              )}
              {setEffects.threePieceEffect && (
                <>
                  <p class="mt-1 text-slate-300"><span class="font-bold">3-Piece:</span></p>
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