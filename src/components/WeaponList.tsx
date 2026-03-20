import { Html } from "@elysiajs/html"
import { SelectWeapon } from "../backend/db/schema"
import { Weapon } from "./Weapon"

export function WeaponList({ weapons }: { weapons: SelectWeapon[] }) {
  return (
    <div class="3xl:max-w-screen-xl mx-auto my-4 grid w-full max-w-5xl grid-cols-1 gap-4">
      {weapons.map((weapon) => (
        <Weapon {...weapon} />
      ))}
    </div>
  )
}
