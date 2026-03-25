import { db } from "../../db"
import { stigmata, stigmataPositions, stigmataStats, stigmataImages, stigmataSetEffects } from "../../db/schema"
import { eq, and, like, inArray, desc, sql } from "drizzle-orm"

/**
 * Parses a search query string and extracts flags for advanced filtering.
 *
 * @flags
 * -single | -1    Filter to stigmata with only one position
 * -set    | -3    Filter to stigmata with all three positions (T/M/B)
 * -t/m/b          Filter stigmata that have the position (T/M/B)
 * -effect "term"  Filter by skill or set effect description
 * -id <number>    Filter by stigmata ID
 */
export function parseSearchQuery(input: string) {
  const flags = {
    name: "",
    effect: "",
    position: "",
    id: null as number | null,
    single: false,
    set: false,
  }

  flags.single = /(-single|-1)\b/.test(input)
  flags.set = /(-set|-3)\b/.test(input)
  input = input.replace(/\s*(-single|-1|-set|-3)\s*/g, "").trim()

  const posMatch = input.match(/-(t|m|b)\b/i)
  if (posMatch) {
    flags.position = posMatch[1].toUpperCase()
    input = input.replace(posMatch[0], "").trim()
  }

  const effectMatch = input.match(/-effect\s+"([^"]+)"|-effect\s+(\S+)/)
  if (effectMatch) {
    flags.effect = effectMatch[1] || effectMatch[2]
    input = input.replace(effectMatch[0], "").trim()
  }

  const idMatch = input.match(/-id\s+(\d+)/)
  if (idMatch) {
    flags.id = Number(idMatch[1])
    input = input.replace(idMatch[0], "").trim()
  }

  flags.name = input.trim()
  return flags
}

export const getFullStigmataData = async (stigmataData: any[]) => {
  if (stigmataData.length === 0) return []

  const stigmataIds = stigmataData.map((s) => s.id)

  const [allPositions, allImages, allSetEffects] = await Promise.all([
    db.select().from(stigmataPositions).where(inArray(stigmataPositions.stigmataId, stigmataIds)),
    db.select().from(stigmataImages).where(inArray(stigmataImages.stigmataId, stigmataIds)),
    db.select().from(stigmataSetEffects).where(inArray(stigmataSetEffects.stigmataId, stigmataIds)),
  ])

  const positionIds = allPositions.map((p) => p.id)
  const allStats =
    positionIds.length > 0
      ? await db.select().from(stigmataStats).where(inArray(stigmataStats.positionId, positionIds))
      : []

  return stigmataData.map((s) => {
    const positions = allPositions
      .filter((p) => p.stigmataId === s.id)
      .map((p) => ({
        ...p,
        stats: allStats.find((st) => st.positionId === p.id) ?? null,
      }))

    return {
      ...s,
      positions,
      images: allImages.filter((img) => img.stigmataId === s.id),
      setEffects: allSetEffects.find((se) => se.stigmataId === s.id) ?? null,
    }
  })
}

export const getStigmata = async ({ query }: { query: any }) => {
  const limit = query.limit ? Number(query.limit) : 10
  const offset = query.offset ? Number(query.offset) : 0

  let stigmataData

  if (query.id) {
    stigmataData = await db
      .select()
      .from(stigmata)
      .where(eq(stigmata.id, Number(query.id)))
    const fullData = await getFullStigmataData(stigmataData)
    return { data: fullData, hasMore: false, hasFlags: false }
  }

  const searchTerm = query.name?.$like?.replace(/%/g, "") || query.name?.replace(/\+/g, " ") || ""
  const flags = parseSearchQuery(searchTerm)
  const fetchAll = !!flags.name || !!flags.effect || flags.single || flags.set || !!flags.position
  const useLoadMore = !fetchAll

  if (flags.id) {
    stigmataData = await db.select().from(stigmata).where(eq(stigmata.id, flags.id))
  } else if (flags.name) {
    stigmataData = await db
      .select()
      .from(stigmata)
      .where(like(stigmata.name, `%${flags.name}%`))
      .orderBy(desc(stigmata.id))
      .limit(fetchAll ? 999 : limit)
      .offset(fetchAll ? 0 : offset)
  } else {
    stigmataData = await db
      .select()
      .from(stigmata)
      .orderBy(desc(stigmata.id))
      .limit(fetchAll ? 999 : limit + 1)
      .offset(fetchAll ? 0 : offset)
      .all()
  }

  let fullData = await getFullStigmataData(stigmataData)

  if (flags.single) fullData = fullData.filter((s) => s.positions.length === 1)
  if (flags.set) fullData = fullData.filter((s) => s.positions.length === 3)
  if (flags.position) {
    fullData = fullData.filter((s) =>
      s.positions.some((p: typeof stigmataPositions.$inferSelect) => p.position === flags.position),
    )
  }
  if (flags.effect) {
    const term = flags.effect.toLowerCase()
    fullData = fullData.filter(
      (s) =>
        s.positions
          .filter((p: typeof stigmataPositions.$inferSelect) => (flags.position ? p.position === flags.position : true))
          .some((p: typeof stigmataPositions.$inferSelect) => p.skillDescription?.toLowerCase().includes(term)) ||
        (!flags.position &&
          (s.setEffects?.twoPieceEffect?.toLowerCase().includes(term) ||
            s.setEffects?.threePieceEffect?.toLowerCase().includes(term))),
    )
  }

  if (flags.single || flags.set || flags.effect) {
    return { data: fullData, hasMore: false, hasFlags: true }
  }

  const hasMore = useLoadMore && fullData.length > limit
  if (hasMore) fullData = fullData.slice(0, limit)
  return { data: fullData, hasMore, hasFlags: useLoadMore }
}

export const postStigmata = async ({ body }: { body: any }) => {
  if (!body.name) throw new Error("Stigmata name is required")

  return await db.transaction(async (tx) => {
    const stigmataResult = await tx.insert(stigmata).values({ name: body.name, rarity: body.rarity }).returning().get()

    if (body.positions) {
      for (const pos of body.positions) {
        const positionResult = await tx
          .insert(stigmataPositions)
          .values({
            stigmataId: stigmataResult.id,
            position: pos.position,
            name: pos.name,
            skillName: pos.skillName,
            skillDescription: pos.skillDescription,
          })
          .returning()
          .get()

        if (pos.stats) {
          await tx.insert(stigmataStats).values({
            positionId: positionResult.id,
            ...pos.stats,
          })
        }
      }
    }

    if (body.images) {
      await tx.insert(stigmataImages).values(
        body.images.map((img: any) => ({
          stigmataId: stigmataResult.id,
          ...img,
        })),
      )
    }

    if (body.setEffects) {
      await tx.insert(stigmataSetEffects).values({
        stigmataId: stigmataResult.id,
        ...body.setEffects,
      })
    }

    return stigmataResult
  })
}

export const patchStigmata = async ({ params, body }: { params: { id: number }; body: any }) => {
  return await db.transaction(async (tx) => {
    const stigmataResult = await tx.select().from(stigmata).where(eq(stigmata.id, params.id)).get()
    if (!stigmataResult) throw new Error("Stigmata not found")

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.rarity !== undefined) updateData.rarity = body.rarity

    if (Object.keys(updateData).length > 0) {
      await tx.update(stigmata).set(updateData).where(eq(stigmata.id, params.id))
    }

    if (body.positions) {
      const positionsToUpdate = Array.isArray(body.positions) ? body.positions : [body.positions]

      for (const pos of positionsToUpdate) {
        const existingPosition = await tx
          .select()
          .from(stigmataPositions)
          .where(and(eq(stigmataPositions.stigmataId, params.id), eq(stigmataPositions.position, pos.position)))
          .get()

        if (existingPosition) {
          const updateData: any = {}
          if (pos.name !== undefined) updateData.name = pos.name
          if (pos.skillName !== undefined) updateData.skillName = pos.skillName
          if (pos.skillDescription !== undefined) updateData.skillDescription = pos.skillDescription

          if (Object.keys(updateData).length > 0) {
            await tx.update(stigmataPositions).set(updateData).where(eq(stigmataPositions.id, existingPosition.id))
          }

          if (pos.stats) {
            const statsUpdateData: any = {}
            if (pos.stats.hp !== undefined) statsUpdateData.hp = Number(pos.stats.hp)
            if (pos.stats.atk !== undefined) statsUpdateData.atk = Number(pos.stats.atk)
            if (pos.stats.def !== undefined) statsUpdateData.def = Number(pos.stats.def)
            if (pos.stats.crt !== undefined) statsUpdateData.crt = Number(pos.stats.crt)
            if (pos.stats.sp !== undefined) statsUpdateData.sp = Number(pos.stats.sp)

            if (Object.keys(statsUpdateData).length > 0) {
              await tx
                .update(stigmataStats)
                .set(statsUpdateData)
                .where(eq(stigmataStats.positionId, existingPosition.id))
            }
          }
        } else {
          if (!pos.name) throw new Error(`Position name is required when creating new position ${pos.position}`)

          const newPosition = await tx
            .insert(stigmataPositions)
            .values({
              stigmataId: params.id,
              position: pos.position,
              name: pos.name,
              skillName: pos.skillName || null,
              skillDescription: pos.skillDescription || null,
            })
            .returning()
            .get()

          if (pos.stats) {
            await tx.insert(stigmataStats).values({
              positionId: newPosition.id,
              hp: pos.stats.hp || null,
              atk: pos.stats.atk || null,
              def: pos.stats.def || null,
              crt: pos.stats.crt || null,
              sp: pos.stats.sp || null,
            })
          }
        }
      }
    }

    if (body.images) {
      const imagesToUpdate = Array.isArray(body.images) ? body.images : [body.images]

      for (const img of imagesToUpdate) {
        const existingImage = await tx
          .select()
          .from(stigmataImages)
          .where(and(eq(stigmataImages.stigmataId, params.id), eq(stigmataImages.position, img.position)))
          .get()

        if (existingImage && img.imgUrl !== undefined) {
          await tx.update(stigmataImages).set({ imgUrl: img.imgUrl }).where(eq(stigmataImages.id, existingImage.id))
        } else if (!existingImage && img.imgUrl) {
          await tx.insert(stigmataImages).values({
            stigmataId: params.id,
            position: img.position,
            imgUrl: img.imgUrl,
          })
        }
      }
    }

    if (body.setEffects) {
      const existingSetEffect = await tx
        .select()
        .from(stigmataSetEffects)
        .where(eq(stigmataSetEffects.stigmataId, params.id))
        .get()

      if (existingSetEffect) {
        const setEffectsUpdateData: any = {}
        if (body.setEffects.setName !== undefined) setEffectsUpdateData.setName = body.setEffects.setName
        if (body.setEffects.twoPieceName !== undefined) setEffectsUpdateData.twoPieceName = body.setEffects.twoPieceName
        if (body.setEffects.twoPieceEffect !== undefined)
          setEffectsUpdateData.twoPieceEffect = body.setEffects.twoPieceEffect
        if (body.setEffects.threePieceName !== undefined)
          setEffectsUpdateData.threePieceName = body.setEffects.threePieceName
        if (body.setEffects.threePieceEffect !== undefined)
          setEffectsUpdateData.threePieceEffect = body.setEffects.threePieceEffect

        if (Object.keys(setEffectsUpdateData).length > 0) {
          await tx
            .update(stigmataSetEffects)
            .set(setEffectsUpdateData)
            .where(eq(stigmataSetEffects.stigmataId, params.id))
        }
      } else {
        await tx.insert(stigmataSetEffects).values({
          stigmataId: params.id,
          setName: body.setEffects.setName || null,
          twoPieceName: body.setEffects.twoPieceName || null,
          twoPieceEffect: body.setEffects.twoPieceEffect || null,
          threePieceName: body.setEffects.threePieceName || null,
          threePieceEffect: body.setEffects.threePieceEffect || null,
        })
      }
    }

    return await tx.select().from(stigmata).where(eq(stigmata.id, params.id)).get()
  })
}

export const deleteStigmata = async ({ params }: { params: { id: number } }) => {
  await db.transaction(async (tx) => {
    const positions = await tx
      .select({ id: stigmataPositions.id })
      .from(stigmataPositions)
      .where(eq(stigmataPositions.stigmataId, params.id))

    for (const position of positions) {
      await tx.delete(stigmataStats).where(eq(stigmataStats.positionId, position.id))
    }

    await tx.delete(stigmataPositions).where(eq(stigmataPositions.stigmataId, params.id))
    await tx.delete(stigmataImages).where(eq(stigmataImages.stigmataId, params.id))
    await tx.delete(stigmataSetEffects).where(eq(stigmataSetEffects.stigmataId, params.id))
    await tx.delete(stigmata).where(eq(stigmata.id, params.id))
    await tx.run(
      sql`DELETE FROM sqlite_sequence WHERE name IN ('stigmata', 'stigmata_positions', 'stigmata_stats', 'stigmata_images', 'stigmata_set_effects')`,
    )
  })

  return { success: true }
}
