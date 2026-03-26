import { db } from "../../db"
import {
  character,
  valkyrie,
  valkyrieSpecialization,
  valkyrieSpecializationTags,
  valkyrieStrengths,
  valkyrieSkills,
  valkyrieCostumes,
} from "../../db/schema"
import { eq, like, asc, sql } from "drizzle-orm"

export const getValkyrie = async ({ query }: { query: any }) => {
  let valkyrieData
  const limit = query.limit ? Number(query.limit) : 10

  if (query.name?.$like) {
    const searchTerm = query.name.$like.replace(/%/g, "")
    valkyrieData = await db
      .select()
      .from(valkyrie)
      .where(like(valkyrie.name, `%${searchTerm}%`))
      .orderBy(asc(valkyrie.name))
      .limit(limit)
  } else if (query.name) {
    const searchTerm = query.name.replace(/\+/g, " ")
    valkyrieData = await db
      .select()
      .from(valkyrie)
      .where(like(valkyrie.name, `%${searchTerm}%`))
      .orderBy(asc(valkyrie.name))
      .limit(limit)
  } else if (query.id) {
    valkyrieData = await db
      .select()
      .from(valkyrie)
      .where(eq(valkyrie.id, Number(query.id)))
  } else {
    valkyrieData = await db.select().from(valkyrie).orderBy(asc(valkyrie.name)).limit(limit).all()
  }

  const fullData = await Promise.all(
    valkyrieData.map(async (v) => {
      const characterData = await db.select().from(character).where(eq(character.id, v.characterId)).get()
      if (!characterData) throw new Error(`Character not found for valkyrie ${v.id}`)

      const specializationData = await db
        .select()
        .from(valkyrieSpecialization)
        .where(eq(valkyrieSpecialization.valkyrieId, v.id))
        .get()

      const specialization = specializationData
        ? {
            ...specializationData,
            tags: await db
              .select()
              .from(valkyrieSpecializationTags)
              .where(eq(valkyrieSpecializationTags.specializationId, specializationData.id))
              .all(),
          }
        : null

      const strengthsData = await db
        .select()
        .from(valkyrieStrengths)
        .where(eq(valkyrieStrengths.valkyrieId, v.id))
        .all()

      const skillsData = await db
        .select()
        .from(valkyrieSkills)
        .where(eq(valkyrieSkills.valkyrieId, v.id))
        .orderBy(asc(valkyrieSkills.skillOrder))
        .all()

      const skills = {
        leader: skillsData.filter((s) => s.category === "leader"),
        passive: skillsData.filter((s) => s.category === "passive"),
        evasion: skillsData.filter((s) => s.category === "evasion"),
        basicAtk: skillsData.filter((s) => s.category === "basicAtk"),
        ultimate: skillsData.filter((s) => s.category === "ultimate"),
        specialAtk: skillsData.filter((s) => s.category === "specialAtk"),
        spSkill: skillsData.filter((s) => s.category === "spSkill"),
        weaponSkill: skillsData.filter((s) => s.category === "weaponSkill"),
        astralRing: skillsData.filter((s) => s.category === "astralRing"),
      }

      const costumesData = await db.select().from(valkyrieCostumes).where(eq(valkyrieCostumes.valkyrieId, v.id)).all()

      return {
        ...v,
        character: characterData ?? null,
        specialization,
        strengths: strengthsData,
        skills,
        costumes: costumesData,
      }
    }),
  )

  return fullData
}

export const postValkyrie = async ({ body }: { body: any }) => {
  if (!body.name) throw new Error("Valkyrie name is required")

  return await db.transaction(async (tx) => {
    // Resolve character by name
    const characterData = await tx.select().from(character).where(eq(character.name, body.character)).get()
    if (!characterData)
      throw new Error(`Character "${body.character}" not found — add them via POST /api/character first`)

    const valkyrieResult = await tx
      .insert(valkyrie)
      .values({
        characterId: characterData.id,
        name: body.name,
        rank: body.rank,
        type: body.type,
        element: body.element,
        weapon: body.weapon,
      })
      .returning()
      .get()

    if (body.specialization) {
      const spResult = await tx
        .insert(valkyrieSpecialization)
        .values({
          valkyrieId: valkyrieResult.id,
          spName: body.specialization.spName,
        })
        .returning()
        .get()

      if (body.specialization.spTag && body.specialization.spTag.length > 0) {
        await tx.insert(valkyrieSpecializationTags).values(
          body.specialization.spTag.map((tag: string) => ({
            specializationId: spResult.id,
            spTag: tag,
          })),
        )
      }
    }

    if (body.strengths && body.strengths.length > 0) {
      await tx.insert(valkyrieStrengths).values(
        body.strengths.map((strength: string) => ({
          valkyrieId: valkyrieResult.id,
          strength,
        })),
      )
    }

    if (body.skills) {
      const skillRows: any[] = []
      for (const category of [
        "leader",
        "passive",
        "evasion",
        "basicAtk",
        "ultimate",
        "specialAtk",
        "spSkill",
        "weaponSkill",
        "astralRing",
      ]) {
        if (body.skills[category]) {
          body.skills[category].forEach((skill: any, index: number) => {
            skillRows.push({
              valkyrieId: valkyrieResult.id,
              category,
              skillOrder: index + 1,
              skillName: skill.skillName,
              skillDescription: skill.skillDescription,
              unlock: skill.unlock,
            })
          })
        }
      }
      if (skillRows.length > 0) {
        await tx.insert(valkyrieSkills).values(skillRows)
      }
    }

    if (body.costumes && body.costumes.length > 0) {
      await tx.insert(valkyrieCostumes).values(
        body.costumes.map((costume: any) => ({
          valkyrieId: valkyrieResult.id,
          name: costume.name,
          imgUrl: costume.imgUrl,
          rarity: costume.rarity,
          unlock: costume.unlock,
          lore: costume.lore || null,
        })),
      )
    }

    return valkyrieResult
  })
}

export const patchValkyrie = async ({ params, body }: { params: { id: number }; body: any }) => {
  return await db.transaction(async (tx) => {
    const valkyrieResult = await tx.select().from(valkyrie).where(eq(valkyrie.id, params.id)).get()
    if (!valkyrieResult) throw new Error("Valkyrie not found")

    // Update core fields
    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.rank !== undefined) updateData.rank = body.rank
    if (body.type !== undefined) updateData.type = body.type
    if (body.element !== undefined) updateData.element = body.element
    if (body.weapon !== undefined) updateData.weapon = body.weapon

    // Resolve character by name if provided
    if (body.character !== undefined) {
      const characterData = await tx.select().from(character).where(eq(character.name, body.character)).get()
      if (!characterData) throw new Error(`Character "${body.character}" not found`)
      updateData.characterId = characterData.id
    }

    if (Object.keys(updateData).length > 0) {
      await tx.update(valkyrie).set(updateData).where(eq(valkyrie.id, params.id))
    }

    // Specialization — replace entirely if provided
    if (body.specialization !== undefined) {
      const existingSpec = await tx
        .select()
        .from(valkyrieSpecialization)
        .where(eq(valkyrieSpecialization.valkyrieId, params.id))
        .get()

      if (existingSpec) {
        await tx
          .delete(valkyrieSpecializationTags)
          .where(eq(valkyrieSpecializationTags.specializationId, existingSpec.id))
        await tx.delete(valkyrieSpecialization).where(eq(valkyrieSpecialization.valkyrieId, params.id))
      }

      if (body.specialization) {
        const spResult = await tx
          .insert(valkyrieSpecialization)
          .values({ valkyrieId: params.id, spName: body.specialization.spName })
          .returning()
          .get()

        if (body.specialization.spTag && body.specialization.spTag.length > 0) {
          await tx.insert(valkyrieSpecializationTags).values(
            body.specialization.spTag.map((tag: string) => ({
              specializationId: spResult.id,
              spTag: tag,
            })),
          )
        }
      }
    }

    // Strengths — replace entirely if provided
    if (body.strengths !== undefined) {
      await tx.delete(valkyrieStrengths).where(eq(valkyrieStrengths.valkyrieId, params.id))
      if (body.strengths.length > 0) {
        await tx.insert(valkyrieStrengths).values(
          body.strengths.map((strength: string) => ({
            valkyrieId: params.id,
            strength,
          })),
        )
      }
    }

    // Skills — update per category + skillOrder
    if (body.skills) {
      for (const category of [
        "leader",
        "passive",
        "evasion",
        "basicAtk",
        "ultimate",
        "specialAtk",
        "spSkill",
        "weaponSkill",
        "astralRing",
      ]) {
        if (body.skills[category]) {
          for (const skill of body.skills[category]) {
            const existingSkill = await tx
              .select()
              .from(valkyrieSkills)
              .where(eq(valkyrieSkills.valkyrieId, params.id))
              .all()
              .then((skills) => skills.find((s) => s.category === category && s.skillOrder === skill.skillOrder))

            if (existingSkill) {
              const skillUpdateData: any = {}
              if (skill.skillName !== undefined) skillUpdateData.skillName = skill.skillName
              if (skill.skillDescription !== undefined) skillUpdateData.skillDescription = skill.skillDescription
              if (skill.unlock !== undefined) skillUpdateData.unlock = skill.unlock

              if (Object.keys(skillUpdateData).length > 0) {
                await tx.update(valkyrieSkills).set(skillUpdateData).where(eq(valkyrieSkills.id, existingSkill.id))
              }
            } else {
              await tx.insert(valkyrieSkills).values({
                valkyrieId: params.id,
                category,
                skillOrder: skill.skillOrder,
                skillName: skill.skillName,
                skillDescription: skill.skillDescription,
                unlock: skill.unlock ?? "Default",
              })
            }
          }
        }
      }
    }

    // Costumes — update per costume name
    if (body.costumes) {
      for (const costume of body.costumes) {
        const existingCostume = await tx
          .select()
          .from(valkyrieCostumes)
          .where(eq(valkyrieCostumes.valkyrieId, params.id))
          .all()
          .then((costumes) => costumes.find((c) => c.name === costume.name))

        if (existingCostume) {
          const costumeUpdateData: any = {}
          if (costume.imgUrl !== undefined) costumeUpdateData.imgUrl = costume.imgUrl
          if (costume.rarity !== undefined) costumeUpdateData.rarity = costume.rarity
          if (costume.unlock !== undefined) costumeUpdateData.unlock = costume.unlock
          if (costume.lore !== undefined) costumeUpdateData.lore = costume.lore

          if (Object.keys(costumeUpdateData).length > 0) {
            await tx.update(valkyrieCostumes).set(costumeUpdateData).where(eq(valkyrieCostumes.id, existingCostume.id))
          }
        } else {
          await tx.insert(valkyrieCostumes).values({
            valkyrieId: params.id,
            name: costume.name,
            imgUrl: costume.imgUrl,
            rarity: costume.rarity ?? 3,
            unlock: costume.unlock ?? "Default",
            lore: costume.lore || null,
          })
        }
      }
    }

    return await tx.select().from(valkyrie).where(eq(valkyrie.id, params.id)).get()
  })
}

export const deleteValkyrie = async ({ params }: { params: { id: number } }) => {
  await db.transaction(async (tx) => {
    const specializationData = await tx
      .select()
      .from(valkyrieSpecialization)
      .where(eq(valkyrieSpecialization.valkyrieId, params.id))
      .get()
    if (specializationData) {
      await tx
        .delete(valkyrieSpecializationTags)
        .where(eq(valkyrieSpecializationTags.specializationId, specializationData.id))
      await tx.delete(valkyrieSpecialization).where(eq(valkyrieSpecialization.valkyrieId, params.id))
    }

    await tx.delete(valkyrieStrengths).where(eq(valkyrieStrengths.valkyrieId, params.id))
    await tx.delete(valkyrieSkills).where(eq(valkyrieSkills.valkyrieId, params.id))
    await tx.delete(valkyrieCostumes).where(eq(valkyrieCostumes.valkyrieId, params.id))
    await tx.delete(valkyrie).where(eq(valkyrie.id, params.id))
    await tx.run(
      sql`DELETE FROM sqlite_sequence WHERE name IN ('valkyrie', 'valkyrie_specialization', 'valkyrie_specialization_tags', 'valkyrie_strengths', 'valkyrie_skills', 'valkyrie_costumes')`,
    )
  })
  return { success: true }
}
