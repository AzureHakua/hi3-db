import { Html } from "@elysiajs/html"
import { SelectAstralOp } from "../backend/db/schema"
import { AstralOp } from "./AstralOp"

export function AstralOpList({ astralOps }: { astralOps: SelectAstralOp[] }) {
  return (
    <div class="3xl:max-w-screen-xl mx-auto my-4 grid w-full max-w-5xl grid-cols-1 gap-4">
      {astralOps.map((astralOp) => (
        <AstralOp {...astralOp} />
      ))}
    </div>
  )
}
