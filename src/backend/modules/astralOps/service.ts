import { db } from "../../db"
import { astralop, astralOpSpecializations, astralOpSkills } from "../../db/schema"
import { eq, like, sql } from "drizzle-orm"

export const getAstralOp = async ({ query }: { query: any }) => {
  let astralOpData
  const limit = query.limit ? Number(query.limit) : 10

  if (query.name?.$like) {
    const searchTerm = query.name.$like.replace(/%/g, "")
    astralOpData = await db
      .select()
      .from(astralop)
      .where(like(astralop.name, `%${searchTerm}%`))
      .limit(limit)
  } else if (query.name) {
    const searchTerm = query.name.replace(/\+/g, " ")
    astralOpData = await db
      .select()
      .from(astralop)
      .where(like(astralop.name, `%${searchTerm}%`))
      .limit(limit)
  } else if (query.id) {
    astralOpData = await db
      .select()
      .from(astralop)
      .where(eq(astralop.id, Number(query.id)))
  } else {
    astralOpData = await db.select().from(astralop).limit(limit).all()
  }

  const fullData = await Promise.all(
    astralOpData.map(async (a) => {
      const specializationsData = await db
        .select()
        .from(astralOpSpecializations)
        .where(eq(astralOpSpecializations.astralOpId, a.id))

      const skillsData = await db
        .select()
        .from(astralOpSkills)
        .where(eq(astralOpSkills.astralOpId, a.id))
        .orderBy(astralOpSkills.skillOrder)

      const skills = {
        synergy: skillsData.filter((s) => s.category === "synergy"),
        recharge: skillsData.filter((s) => s.category === "recharge"),
        passive: skillsData.filter((s) => s.category === "passive"),
      }

      return { ...a, specializations: specializationsData, skills }
    }),
  )

  return fullData
}

export const postAstralOp = async ({ body }: { body: any }) => {
  if (!body.name) throw new Error("AstralOp name is required")

  return await db.transaction(async (tx) => {
    const astralOpResult = await tx
      .insert(astralop)
      .values({ name: body.name, imgUrl: body.imgUrl, element: body.element })
      .returning()
      .get()

    if (body.specializations && body.specializations.length > 0) {
      await tx.insert(astralOpSpecializations).values(
        body.specializations.map((sp: any) => ({
          astralOpId: astralOpResult.id,
          spName: sp.spName,
          spTag: sp.spTag,
        })),
      )
    }

    if (body.skills) {
      const skillRows: any[] = []
      for (const category of ["synergy", "recharge", "passive"]) {
        if (body.skills[category]) {
          body.skills[category].forEach((skill: any, index: number) => {
            skillRows.push({
              astralOpId: astralOpResult.id,
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
        await tx.insert(astralOpSkills).values(skillRows)
      }
    }

    return astralOpResult
  })
}

export const patchAstralOp = async ({ params, body }: { params: { id: number }; body: any }) => {
  return await db.transaction(async (tx) => {
    const astralOpResult = await tx.select().from(astralop).where(eq(astralop.id, params.id)).get()
    if (!astralOpResult) throw new Error("AstralOp not found")

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.imgUrl !== undefined) updateData.imgUrl = body.imgUrl
    if (body.element !== undefined) updateData.element = body.element

    if (Object.keys(updateData).length > 0) {
      await tx.update(astralop).set(updateData).where(eq(astralop.id, params.id))
    }

    // Specializations are replaced entirely when provided
    if (body.specializations !== undefined) {
      await tx.delete(astralOpSpecializations).where(eq(astralOpSpecializations.astralOpId, params.id))
      if (body.specializations.length > 0) {
        await tx.insert(astralOpSpecializations).values(
          body.specializations.map((sp: any) => ({
            astralOpId: params.id,
            spName: sp.spName,
            spTag: sp.spTag,
          })),
        )
      }
    }

    // Skills are updated per skillOrder within each category
    if (body.skills) {
      for (const category of ["synergy", "recharge", "passive"]) {
        if (body.skills[category]) {
          for (const skill of body.skills[category]) {
            const existingSkill = await tx
              .select()
              .from(astralOpSkills)
              .where(eq(astralOpSkills.astralOpId, params.id))
              .all()
              .then((skills) => skills.find((s) => s.category === category && s.skillOrder === skill.skillOrder))

            if (existingSkill) {
              const skillUpdateData: any = {}
              if (skill.skillName !== undefined) skillUpdateData.skillName = skill.skillName
              if (skill.skillDescription !== undefined) skillUpdateData.skillDescription = skill.skillDescription
              if (skill.unlock !== undefined) skillUpdateData.unlock = skill.unlock

              if (Object.keys(skillUpdateData).length > 0) {
                await tx.update(astralOpSkills).set(skillUpdateData).where(eq(astralOpSkills.id, existingSkill.id))
              }
            }
          }
        }
      }
    }

    return await tx.select().from(astralop).where(eq(astralop.id, params.id)).get()
  })
}

export const deleteAstralOp = async ({ params }: { params: { id: number } }) => {
  await db.transaction(async (tx) => {
    await tx.delete(astralOpSkills).where(eq(astralOpSkills.astralOpId, params.id))
    await tx.delete(astralOpSpecializations).where(eq(astralOpSpecializations.astralOpId, params.id))
    await tx.delete(astralop).where(eq(astralop.id, params.id))
    await tx.run(
      sql`DELETE FROM sqlite_sequence WHERE name IN ('astralop', 'astralop_specializations', 'astralop_skills')`,
    )
  })
  return { success: true }
}
