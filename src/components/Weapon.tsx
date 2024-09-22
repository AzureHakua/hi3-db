import { html, Html } from '@elysiajs/html'
import { SelectWeapon } from '../backend/db/schema'

export function Weapon(props: SelectWeapon) {
  const { id, name, atk, crt, images, skills } = props;
  const maxImage = images && images.length > 0 ? images[0].maxUrl : '';

  return (
    <div class="bg-slate-700 shadow-lg rounded-lg overflow-hidden">
      <div class="flex flex-col md:grid md:grid-cols-2">

        <div class="mx-4 mt-4">

          <div class="flex items-center justify-between my-3 px-3">
            <hr class="w-full border-slate-600"></hr>
            <div class="font-semibold rounded-full border text-slate-300 py-1 px-3 mx-auto whitespace-nowrap">{name}</div>
            <hr class="w-full border-slate-600"></hr>
          </div>

          <div class="text-slate-300">
            <div class="m-4 flex justify-center items-center space-x-8">
                <p class="font-medium text-lg">ATK:<span class="mx-1"></span>{atk}</p>
                <p class="font-medium text-lg">CRT:<span class="mx-1"></span>{crt}</p>
            </div>
          </div>
        </div>

        <div class="mx-4 mt-6 flex flex-col justify-end">
          <div class="flex justify-center">
            <img src={maxImage ?? ''} alt={`${name}`} class="flex max-w-full max-h-full border-2 border-slate-400 object-cover rounded"/>
          </div>
        </div>
      </div>


      <div class="flex flex-col col-span-2 mx-4 mb-4">
        {skills && skills.length > 0 && (
          <div class="text-sm border-t border-slate-700 text-slate-200 p-4">
            {skills.map((skill) => (
              <div>
                <p class="text-slate-300 font-medium text-lg">{skill.skillName}</p>
                <p class="text-sm text-slate-400 mt-1">{skill.skillDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}