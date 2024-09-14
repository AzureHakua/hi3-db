import { html, Html } from '@elysiajs/html'
import { SelectStigmata } from '../backend/db/schema'

export function Stigma(props: SelectStigmata) {
  const { id, name, positions, images, setEffects } = props;
  const bigImages = images?.filter(img => img.bigUrl);

  return (
    <div class="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div class="flex flex-col md:grid md:grid-cols-2">
        
        <div class="m-4">
          <div class="flex items-center justify-between my-3 px-3">
            <hr class="w-full border-slate-600"></hr>
            <div class="font-semibold rounded-full border text-slate-200 py-1 px-3 mx-auto whitespace-nowrap">{name}</div>
            <hr class="w-full border-slate-600"></hr>
          </div>

          <div class="grid grid-cols-3 gap-4 mt-8 mx-4 whitespace-nowrap">
            {positions && positions.map((pos, index) => (
              <div data-key={index} class={`${positions.length === 1 ? 'col-start-2' : ''} relative p-4 mb-6 rounded-full aspect-square border-2 border-slate-400 hover:scale-105 hover:border-slate-100 shadow-[0px_0px_5px_0px_white] transition-all duration-[0.2s] ease-[ease-in-out] cursor-pointer`}
                id={`icon-${id}-${index}`}
                hx-get={`/stigmata/${props.id}/position/${index}`}
                hx-target={`#content-container-${id}`}
                hx-swap="innerHTML">
                {images && images.find(img => img.position === pos.position) && (
                  <img src={images.find(img => img.position === pos.position)?.iconUrl ?? ''} alt={`${name} ${pos.position}`} class="object-cover rounded-full" />
                )}
                <div class="bg-slate-100 text-indigo-800 font-semibold rounded-full absolute px-3 -translate-x-2/4 left-2/4 mt-4">{pos.position}</div>
              </div>
            ))}
          </div>
        </div>

        <div id={`content-container-${id}`} class="text-slate-100 py-4">
          {positions && positions.map((pos, index) => (
            <div id={`content-${id}-${index}`} class={index === 0 ? '' : 'hidden'}>
              {bigImages && bigImages.length > 0 && (
                <div class="rounded-full border-2 border-slate-100 overflow-hidden aspect-square mx-20 shadow-[0px_0px_10px_0px_white] hidden md:flex">
                  <img src={bigImages.find(img => img.position === pos.position)?.bigUrl ?? ''} alt={`${name} ${pos.position}`} class="object-cover rounded" />
                </div>
              )}
              <div class="m-4">
                <p class="font-medium text-lg text-gray-200">{pos.skillName}</p>
                <p class="text-sm text-gray-400 mt-1">{pos.skillDescription}</p>
              </div>
            </div>
          ))}
        </div>

        <div class="flex flex-col col-span-2 mx-4">
          {setEffects && (setEffects.setName || setEffects.twoPieceEffect || setEffects.threePieceEffect) && (
            <div class="text-sm border-t border-gray-700 text-gray-200 mt-4 p-4">
              {setEffects.setName && <p class="font-medium">Set: {setEffects.setName}</p>}
              {setEffects.twoPieceEffect && (
                <>
                  <p class="mt-1 text-gray-300"><span class="font-bold">2-Piece:</span></p>
                  <p class="mt-1 text-gray-400">{setEffects.twoPieceEffect}</p>
                </>
              )}
              {setEffects.threePieceEffect && (
                <>
                  <p class="mt-1 text-gray-300"><span class="font-bold">3-Piece:</span></p>
                  <p class="mt-1 text-gray-400">{setEffects.threePieceEffect}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}