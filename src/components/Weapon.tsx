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
                        <div class="m-4">
                            <p class="font-medium text-lg pl-2">ATK: <span class="mx-2"></span>{atk}</p>
                            <p class="font-medium text-lg pl-2">CRT: <span class="mx-2"></span>{crt}</p>
                        </div>
                    </div>

                </div>


                <div class="mx-4 mt-4">

                    <div class="grid grid-cols-3 gap-8 px-12 mx-4 my-8 whitespace-nowrap">
                        <img src={maxImage ?? ''} alt={`${name}`} class="w-full h-full object-cover" />
                    </div>
                </div>
            </div>


            <div class="flex flex-col col-span-2 mx-4 mb-4">
                {skills && skills.length > 0 && (
                    <div class="text-sm border-t border-slate-700 text-slate-200 mt-4 p-4">
                        <p class="font-medium text-lg">Weapon Skills:</p>
                        {skills.map((skill) => (
                            <div class="mt-2">
                                <p class="text-slate-300"><span class="font-bold">{skill.skillName}:</span></p>
                                <p class="mt-1 text-slate-400">{skill.skillDescription}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}