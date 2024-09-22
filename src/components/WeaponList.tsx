import { html, Html } from '@elysiajs/html'
import { SelectWeapon, weapon } from '../backend/db/schema'
import { Weapon } from './Weapon'

export function WeaponList({ weapons }: { weapons: SelectWeapon[] }) {
  return (
    <div class="grid grid-cols-1 max-w-5xl 3xl:max-w-screen-xl w-full gap-4 my-4 mx-auto">
      {weapons.map((weapon) => (
        <Weapon {...weapon} />
      ))}
    </div>
  )
}