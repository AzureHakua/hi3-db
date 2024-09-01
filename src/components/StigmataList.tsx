import { html, Html } from '@elysiajs/html'
import { SelectStigmata } from '../backend/db/schema'
import { Stigma } from './Stigma'

export function StigmataList({ stigmata }: { stigmata: SelectStigmata[] }) {
  return (
    <div>
      {stigmata.map((stigma) => (
        <Stigma {...stigma} />
      ))}
    </div>
  )
}