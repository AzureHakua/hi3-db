import { Html } from '@elysiajs/html'
import { SelectAstralOp } from '../backend/db/schema'
import { AstralOp } from './AstralOp'

export function AstralOpList({ astralOps }: { astralOps: SelectAstralOp[] }) {
  return (
    <div class="grid grid-cols-1 max-w-5xl 3xl:max-w-screen-xl w-full gap-4 my-4 mx-auto">
      {astralOps.map((astralOp) => (
        <AstralOp {...astralOp} />
      ))}
    </div>
  )
}
