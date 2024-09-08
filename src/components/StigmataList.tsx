import { html, Html } from '@elysiajs/html'
import { SelectStigmata } from '../backend/db/schema'
import { Stigma } from './Stigma'

export function StigmataList({ stigmata }: { stigmata: SelectStigmata[] }) {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {stigmata.map((stigma) => (
        <Stigma {...stigma} />
      ))}
    </div>
  )
}