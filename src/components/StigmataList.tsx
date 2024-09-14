import { html, Html } from '@elysiajs/html'
import { SelectStigmata } from '../backend/db/schema'
import { Stigma } from './Stigma'

export function StigmataList({ stigmata }: { stigmata: SelectStigmata[] }) {
  return (
    <div class="grid grid-cols-1 max-w-5xl 3xl:max-w-screen-xl w-full gap-4 my-4 mx-auto">
      {stigmata.map((stigma) => (
        <Stigma {...stigma} />
      ))}
    </div>
  )
}