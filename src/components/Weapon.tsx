import { Html } from "@elysiajs/html"
import { SelectWeapon } from "../backend/db/schema"

export function Weapon(props: SelectWeapon) {
  const { id, name, atk, crt, images, skills } = props
  const maxImage = images && images.length > 0 ? images[0].maxUrl : ""

  return (
    <div class="overflow-hidden rounded-lg bg-slate-700 shadow-lg">
      <div class="flex flex-col md:grid md:grid-cols-2">
        <div class="mx-4 mt-4">
          <div class="my-3 flex items-center justify-between px-3">
            <hr class="w-full border-slate-600"></hr>
            <div class="mx-auto whitespace-nowrap rounded-full border px-3 py-1 font-semibold text-slate-300">
              {name}
            </div>
            <hr class="w-full border-slate-600"></hr>
          </div>

          <div class="text-slate-300">
            <div class="m-4 flex items-center justify-center">
              <div class="p-4">
                <p class="text-lg font-medium">ATK: {atk}</p>
              </div>
              <div class="p-4">
                <p class="text-lg font-medium">CRT: {crt}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mx-4 mt-4 flex flex-col justify-end">
          <div class="mt-2 flex justify-center">
            <img
              src={maxImage ?? ""}
              alt={`${name}`}
              class="flex max-h-full max-w-full rounded border-2 border-slate-400 object-cover"
            />
          </div>

          {/* ID section - dedicated space below image */}
          <div class="mt-2">
            <div class="text-center">
              <span class="rounded border border-slate-600 bg-slate-800/80 px-3 py-1.5 font-mono text-xs text-slate-400">
                ID: {String(id).padStart(3, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-2 mx-4 mb-4 flex flex-col">
        {skills && skills.length > 0 && (
          <div class="border-t border-slate-700 p-4 text-sm text-slate-200">
            {skills.map((skill) => (
              <div>
                <p class="text-lg font-medium text-slate-300">{skill.skillName}</p>
                <p class="mb-4 mt-2 text-sm text-slate-400">{skill.skillDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
