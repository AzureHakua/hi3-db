import { db } from "../../db"
import { weapon, weaponSkills } from "../../db/schema"
import { eq, like, sql } from "drizzle-orm"

export const getWeapon = async ({ query }: { query: any }) => {
  let weaponData
  const limit = query.limit ? Number(query.limit) : 10

  if (query.name?.$like) {
    const searchTerm = query.name.$like.replace(/%/g, "")
    weaponData = await db
      .select()
      .from(weapon)
      .where(like(weapon.name, `%${searchTerm}%`))
      .limit(limit)
  } else if (query.name) {
    const searchTerm = query.name.replace(/\+/g, " ")
    weaponData = await db
      .select()
      .from(weapon)
      .where(like(weapon.name, `%${searchTerm}%`))
      .limit(limit)
  } else if (query.id) {
    weaponData = await db
      .select()
      .from(weapon)
      .where(eq(weapon.id, Number(query.id)))
  } else {
    weaponData = await db.select().from(weapon).limit(limit).all()
  }

  const fullData = await Promise.all(
    weaponData.map(async (w) => {
      const skillsData = await db.select().from(weaponSkills).where(eq(weaponSkills.weaponId, w.id))
      return { ...w, skills: skillsData }
    }),
  )

  return fullData
}

export const postWeapon = async ({ body }: { body: any }) => {
  if (!body.name) throw new Error("Weapon name is required")

  return await db.transaction(async (tx) => {
    const weaponResult = await tx
      .insert(weapon)
      .values({
        name: body.name,
        atk: body.atk,
        crt: body.crt,
        baseUrl: body.baseUrl,
        maxUrl: body.maxUrl,
      })
      .returning()
      .get()

    if (body.skills && body.skills.length > 0) {
      await tx.insert(weaponSkills).values(
        body.skills.map((skill: any) => ({
          weaponId: weaponResult.id,
          skillName: skill.skillName,
          skillDescription: skill.skillDescription,
        })),
      )
    }

    return weaponResult
  })
}

export const patchWeapon = async ({ params, body }: { params: { id: number }; body: any }) => {
  return await db.transaction(async (tx) => {
    const weaponResult = await tx.select().from(weapon).where(eq(weapon.id, params.id)).get()
    if (!weaponResult) throw new Error("Weapon not found")

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.atk !== undefined) updateData.atk = body.atk
    if (body.crt !== undefined) updateData.crt = body.crt
    if (body.baseUrl !== undefined) updateData.baseUrl = body.baseUrl
    if (body.maxUrl !== undefined) updateData.maxUrl = body.maxUrl

    if (Object.keys(updateData).length > 0) {
      await tx.update(weapon).set(updateData).where(eq(weapon.id, params.id))
    }

    // Skills are updated per skill id, or inserted if no id provided
    if (body.skills) {
      for (const skill of body.skills) {
        if (skill.id) {
          const skillUpdateData: any = {}
          if (skill.skillName !== undefined) skillUpdateData.skillName = skill.skillName
          if (skill.skillDescription !== undefined) skillUpdateData.skillDescription = skill.skillDescription

          if (Object.keys(skillUpdateData).length > 0) {
            await tx.update(weaponSkills).set(skillUpdateData).where(eq(weaponSkills.id, skill.id))
          }
        } else {
          await tx.insert(weaponSkills).values({
            weaponId: params.id,
            skillName: skill.skillName,
            skillDescription: skill.skillDescription,
          })
        }
      }
    }

    return await tx.select().from(weapon).where(eq(weapon.id, params.id)).get()
  })
}

export const deleteWeapon = async ({ params }: { params: { id: number } }) => {
  await db.transaction(async (tx) => {
    await tx.delete(weaponSkills).where(eq(weaponSkills.weaponId, params.id))
    await tx.delete(weapon).where(eq(weapon.id, params.id))
    await tx.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('weapon', 'weapon_skills')`)
  })
  return { success: true }
}
