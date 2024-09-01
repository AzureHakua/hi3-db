import { html, Html } from '@elysiajs/html'
import { SelectStigmata } from '../backend/db/schema'

export function Stigma({ name, pos, id }: SelectStigmata) {
  return (
    <div>
      <p>{name} : {pos} : {id}</p>
    </div>
  )
}