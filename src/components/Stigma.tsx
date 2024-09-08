import { html, Html } from '@elysiajs/html'
import { SelectStigmata } from '../backend/db/schema'

export function Stigma(props: SelectStigmata) {
  const { name, positions, images, setEffects } = props;

  const iconImage = images?.find(img => img.iconUrl);
  const bigImages = images?.filter(img => img.bigUrl);

  return (
    <div class="bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-xl text-indigo-500">{name}</h2>
        </div>

        {positions && positions.map(pos => (
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-lg text-indigo-500">{pos.position}</h3>
              <p class="text-sm font-medium text-gray-200">{pos.skillName}</p>
              {images && images.find(img => img.position === pos.position) && (
                <img src={images.find(img => img.position === pos.position)?.iconUrl ?? ''} alt={`${name} ${pos.position}`} class="w-12 h-12 object-cover rounded-full" />
              )}
            </div>
            <p class="text-sm text-gray-400 mt-1">{pos.skillDescription}</p>
          </div>
        ))}

        {setEffects && (setEffects.setName || setEffects.twoPieceEffect || setEffects.threePieceEffect) && (
          <div class="text-sm text-gray-200 mt-2">
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

      {bigImages && bigImages.length > 0 && (
        <div class="mt-4 p-4 border-t border-gray-700">
          <div class="flex justify-center space-x-2">
            {bigImages.map(img => (
              <img src={img.bigUrl ?? ''} alt={`${name} ${img.position}`} class="w-40 h-40 object-cover rounded" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}