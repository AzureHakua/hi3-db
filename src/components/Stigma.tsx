import { html, Html } from '@elysiajs/html'
import { SelectStigmata } from '../backend/db/schema'

export function Stigma({ name, id }: SelectStigmata) {
  return (
    <div>
      <p>{name} : {id}</p>
    </div>
  )
}