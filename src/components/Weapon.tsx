import { Html } from "@elysiajs/html"
import { SelectWeapon } from "../backend/db/schema"

export function Weapon(props: SelectWeapon) {
  const { name, atk, crt, images, skills } = props
  const maxImage = images?.[0]?.maxUrl ?? ""
  const firstSkill = skills?.[0]
  const restSkills = skills?.slice(1) ?? []

  return (
    <div class="overflow-hidden rounded-lg bg-slate-700 shadow-lg">
      {/* Full-width name header */}
      <div class="mx-4 mt-4 flex items-center px-3">
        <hr class="w-full border-slate-600" />
        <div class="mx-auto whitespace-nowrap rounded-full border px-3 py-1 font-semibold text-slate-300">{name}</div>
        <hr class="w-full border-slate-600" />
      </div>

      <div class="flex flex-col md:grid md:grid-cols-2">
        {/* Left col: image + stats + first skill */}
        <div class="mx-4 mt-3 flex flex-col items-center gap-3 md:mr-2 md:mb-4">
          <img
            src={maxImage}
            alt={name}
            class="max-w-full rounded border-2 border-slate-400 object-contain"
            loading="lazy"
          />

          <span class="rounded border border-slate-500 bg-slate-600/50 px-3 py-1 text-sm font-medium text-slate-200">
            ATK: {atk}&nbsp;&nbsp;&nbsp;CRT: {crt}
          </span>

          {firstSkill && (
            <div class="w-full rounded-lg bg-slate-600/50 p-3">
              <p class="font-medium text-slate-200">{firstSkill.skillName}</p>
              <p class="mt-1 text-sm text-slate-400">{firstSkill.skillDescription}</p>
            </div>
          )}
        </div>

        {/* Right col: remaining skills, vertically centered */}
        <div class="mx-4 my-4 flex flex-col justify-center gap-4 md:ml-2">
          {restSkills.map((skill) => (
            <div class="rounded-lg bg-slate-600/50 p-3">
              <p class="font-medium text-slate-200">{skill.skillName}</p>
              <p class="mt-1 text-sm text-slate-400">{skill.skillDescription}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
