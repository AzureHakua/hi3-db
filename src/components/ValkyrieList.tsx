import { Html } from "@elysiajs/html"
import { SelectValkyrie } from "../backend/db/schema"
import { Valkyrie } from "./Valkyrie"

export function ValkyrieList({ valkyries }: { valkyries: SelectValkyrie[] }) {
  return (
    <div class="3xl:max-w-screen-xl mx-auto my-4 grid w-full max-w-5xl grid-cols-1 gap-4">
      {valkyries.map((valkyrie) => (
        <Valkyrie {...valkyrie} />
      ))}
    </div>
  )
}
