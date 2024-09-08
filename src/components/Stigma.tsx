import { html, Html } from '@elysiajs/html'
import { SelectStigmata } from '../backend/db/schema'

export function Stigma({ name, id, positions, images, setEffects }: SelectStigmata & { positions: any[], images: any[], setEffects: any }) {
  return (
    <div class="bg-white shadow-lg rounded-lg overflow-hidden m-4">
      <div class="px-6 py-4">
        <h2 class="font-bold text-xl mb-2">{name}</h2>
        <p class="text-gray-700 text-base">ID: {id}</p>
        
        {positions && positions.map((pos) => (
          <div key={pos.id} class="mt-4">
            <h3 class="font-semibold text-lg">{pos.position}</h3>
            <p>Skill: {pos.skillName}</p>
            <p class="text-sm text-gray-600">{pos.skillDescription}</p>
            {pos.stats && (
              <div class="mt-2">
                <p>HP: {pos.stats.hp}, ATK: {pos.stats.atk}, DEF: {pos.stats.def}</p>
                <p>CRT: {pos.stats.crt}, SP: {pos.stats.sp}</p>
              </div>
            )}
          </div>
        ))}
        
        {images && images.length > 0 && (
          <div class="mt-4">
            <img src={images[0].iconUrl} alt={name} class="w-16 h-16 object-cover rounded" />
          </div>
        )}
        
        {setEffects && (
          <div class="mt-4">
            <h3 class="font-semibold">Set Effects</h3>
            <p>2-Piece: {setEffects.twoPieceEffect}</p>
            <p>3-Piece: {setEffects.threePieceEffect}</p>
          </div>
        )}
      </div>
    </div>
  )
}