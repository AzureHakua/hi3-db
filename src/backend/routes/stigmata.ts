import { Elysia, t } from 'elysia'
import { db } from '../db'
import { stigmata, stigmataPositions, stigmataStats, stigmataImages, stigmataSetEffects } from '../db/schema'
import { eq, and, like, desc } from 'drizzle-orm'
import { sql } from 'drizzle-orm';

const API_KEY = process.env.API_KEY

if (!API_KEY) {
  console.error('API_KEY is not set in environment variables')
  process.exit(1)
}

/**
 * ! When dealing with the Stigmata, please note that Stigma is singular and Stigmata is plural.
 *   Please use Stigmata whenever possible to avoid confusion unless there is a specific reason to use Stigma.
 */

/**
 * Checks if the provided authorization header contains a valid API key.
 * @param {Object} params - The parameters object.
 * @param {Object} params.headers - The request headers.
 * @param {string} params.headers.authorization - The authorization header.
 * @throws {Error} If the authorization header is missing, invalid, or contains an invalid API key.
 */
const checkAuth = ({ headers }: { headers: { authorization: string } }) => {
  if (!headers.authorization || !headers.authorization.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header')
  }
  const token = headers.authorization.split(' ')[1]
  if (token !== API_KEY) {
    throw new Error('Invalid API key')
  }
}

/**
 * Retrieves stigmata based on the provided query parameters.
 * @param {Object} params.query - The query parameters.
 * @returns {Array} An array of stigmata objects.
 */
function parseSearchQuery(input: string) {
  const flags = {
    name: '',
    effect: '',
    id: null as number | null,
    single: false,
    set: false,
    more: false,
  }

  // Extract boolean flags
  flags.single = /(-single|-1)\b/.test(input)
  flags.set = /(-set|-3)\b/.test(input)
  flags.more = input.includes('-more')
  input = input.replace(/(-single|-1|-set|-3|-more)\b/g, '').trim()

  // Extract -effect with optional quotes
  const effectMatch = input.match(/-effect\s+"([^"]+)"|-effect\s+(\S+)/)
  if (effectMatch) {
    flags.effect = effectMatch[1] || effectMatch[2]
    input = input.replace(effectMatch[0], '').trim()
  }

  // Extract -id
  const idMatch = input.match(/-id\s+(\d+)/)
  if (idMatch) {
    flags.id = Number(idMatch[1])
    input = input.replace(idMatch[0], '').trim()
  }

  flags.name = input.trim()
  return flags
}

export const getStigmata = async ({ query }: { query: any }) => {
  console.log('getStigmata called with query:', query)
  const limit = query.limit ? Number(query.limit) : 10;
  const offset = query.offset ? Number(query.offset) : 0;

  let stigmataData;

  if (query.id) {
    stigmataData = await db.select().from(stigmata).where(eq(stigmata.id, Number(query.id)));
    const fullData = await getFullStigmataData(stigmataData);
    return { data: fullData, hasMore: false, hasFlags: false };
  }

  const searchTerm = query.name?.$like?.replace(/%/g, '') || query.name?.replace(/\+/g, ' ') || '';
  const flags = parseSearchQuery(searchTerm);
  const useLoadMore = flags.single || flags.set || flags.more || !!flags.effect || !!flags.id;
  const fetchLimit = flags.effect ? 999 : limit + 1;

  if (flags.id) {
    stigmataData = await db.select().from(stigmata).where(eq(stigmata.id, flags.id));
  } else if (flags.name) {
    stigmataData = await db.select()
      .from(stigmata)
      .where(like(stigmata.name, `%${flags.name}%`))
      .orderBy(desc(stigmata.id))
      .limit(flags.effect ? 999 : (useLoadMore ? fetchLimit : limit))
      .offset(flags.effect ? 0 : offset);
  } else {
    stigmataData = await db.select()
      .from(stigmata)
      .orderBy(desc(stigmata.id))
      .limit(flags.effect ? 999 : (useLoadMore ? fetchLimit : limit))
      .offset(flags.effect ? 0 : offset)
      .all();
  }

  let fullData = await getFullStigmataData(stigmataData);

  // Post-filter
  if (flags.single) fullData = fullData.filter(s => s.positions.length === 1);
  if (flags.set) fullData = fullData.filter(s => s.positions.length === 3);
  if (flags.effect) {
    const term = flags.effect.toLowerCase();
    fullData = fullData.filter(s =>
      s.positions.some((p: typeof stigmataPositions.$inferSelect) => p.skillDescription?.toLowerCase().includes(term)) ||
      s.setEffects?.twoPieceEffect?.toLowerCase().includes(term) ||
      s.setEffects?.threePieceEffect?.toLowerCase().includes(term)
    );
    return { data: fullData, hasMore: false, hasFlags: true };
  }

  const hasMore = useLoadMore && fullData.length > limit;
  if (hasMore) fullData = fullData.slice(0, limit);

  return { data: fullData, hasMore, hasFlags: useLoadMore };
}

// Extract full data fetching into reusable function
const getFullStigmataData = async (stigmataData: any[]) => {
  return await Promise.all(stigmataData.map(async (s) => {
    let positionsData = await db.select().from(stigmataPositions).where(eq(stigmataPositions.stigmataId, s.id));

    const positionsWithStats = await Promise.all(positionsData.map(async (p) => {
      const statsData = await db.select().from(stigmataStats).where(eq(stigmataStats.positionId, p.id));
      return { ...p, stats: statsData[0] };
    }));

    const imagesData = await db.select().from(stigmataImages).where(eq(stigmataImages.stigmataId, s.id));
    const setEffectsData = await db.select().from(stigmataSetEffects).where(eq(stigmataSetEffects.stigmataId, s.id));

    return {
      ...s,
      positions: positionsWithStats,
      images: imagesData,
      setEffects: setEffectsData[0],
    };
  }));
}

/**
 * Creates a new stigmata entry.
 * @param {Object} params.body - The request body.
 * @returns {Object} The created stigmata object.
 */
export const postStigmata = async ({ body }: { body: any }) => {
  console.log('postStigmata called');
  if (!body.name) {
    throw new Error('Stigmata name is required');
  }

  const newStigma = await db.transaction(async (tx) => {
    const stigmataResult = await tx.insert(stigmata).values({ name: body.name }).returning().get();

    if (body.positions) {
      for (const pos of body.positions) {
        const positionResult = await tx.insert(stigmataPositions).values({
          stigmataId: stigmataResult.id,
          position: pos.position,
          name: pos.name,
          skillName: pos.skillName,
          skillDescription: pos.skillDescription,
        }).returning().get();

        if (pos.stats) {
          await tx.insert(stigmataStats).values({
            positionId: positionResult.id,
            ...pos.stats,
          });
        }
      }
    }

    if (body.images) {
      await tx.insert(stigmataImages).values(body.images.map((img: any) => ({
        stigmataId: stigmataResult.id,
        ...img,
      })));
    }

    if (body.setEffects) {
      await tx.insert(stigmataSetEffects).values({
        stigmataId: stigmataResult.id,
        ...body.setEffects,
      });
    }

    return stigmataResult;
  });

  return newStigma;
}

/**
 * Updates an existing stigmata entry with partial updates.
 * @param {Object} params.body - The request body.
 * @returns {Object} The updated stigmata object.
 */
export const patchStigmata = async ({ params, body }: { params: { id: number }, body: any }) => {
  console.log('patchStigmata called', params);

  return await db.transaction(async (tx) => {
    const stigmataResult = await tx.select().from(stigmata).where(eq(stigmata.id, params.id)).get();
    if (!stigmataResult) {
      throw new Error('Stigmata not found');
    }

    // Update stigmata name if provided
    if (body.name) {
      await tx.update(stigmata).set({ name: body.name }).where(eq(stigmata.id, params.id));
    }

    // Update positions if provided
    if (body.positions) {
      const positionsToUpdate = Array.isArray(body.positions) ? body.positions : [body.positions];

      for (const pos of positionsToUpdate) {
        const existingPosition = await tx.select()
          .from(stigmataPositions)
          .where(and(
            eq(stigmataPositions.stigmataId, params.id),
            eq(stigmataPositions.position, pos.position)
          ))
          .get();

        if (existingPosition) {
          // Only update fields that are provided (partial update)
          const updateData: any = {};
          if (pos.name !== undefined) updateData.name = pos.name;
          if (pos.skillName !== undefined) updateData.skillName = pos.skillName;
          if (pos.skillDescription !== undefined) updateData.skillDescription = pos.skillDescription;

          // Only update if there's something to update
          if (Object.keys(updateData).length > 0) {
            await tx.update(stigmataPositions)
              .set(updateData)
              .where(eq(stigmataPositions.id, existingPosition.id));
          }

          // Update stats if provided
          if (pos.stats) {
            const statsUpdateData: any = {};
            if (pos.stats.hp !== undefined) statsUpdateData.hp = Number(pos.stats.hp);
            if (pos.stats.atk !== undefined) statsUpdateData.atk = Number(pos.stats.atk);
            if (pos.stats.def !== undefined) statsUpdateData.def = Number(pos.stats.def);
            if (pos.stats.crt !== undefined) statsUpdateData.crt = Number(pos.stats.crt);
            if (pos.stats.sp !== undefined) statsUpdateData.sp = Number(pos.stats.sp);

            if (Object.keys(statsUpdateData).length > 0) {
              await tx.update(stigmataStats)
                .set(statsUpdateData)
                .where(eq(stigmataStats.positionId, existingPosition.id));
            }
          }
        } else {
          // Create new position (all required fields must be provided)
          if (!pos.name) {
            throw new Error(`Position name is required when creating new position ${pos.position}`);
          }

          const newPosition = await tx.insert(stigmataPositions)
            .values({
              stigmataId: params.id,
              position: pos.position,
              name: pos.name,
              skillName: pos.skillName || null,
              skillDescription: pos.skillDescription || null,
            })
            .returning()
            .get();

          // Create stats if provided
          if (pos.stats) {
            await tx.insert(stigmataStats)
              .values({
                positionId: newPosition.id,
                hp: pos.stats.hp || null,
                atk: pos.stats.atk || null,
                def: pos.stats.def || null,
                crt: pos.stats.crt || null,
                sp: pos.stats.sp || null,
              });
          }
        }
      }
    }

    // Update images if provided
    if (body.images) {
      const imagesToUpdate = Array.isArray(body.images) ? body.images : [body.images];

      for (const img of imagesToUpdate) {
        // Check if image exists for this position
        const existingImage = await tx.select()
          .from(stigmataImages)
          .where(and(
            eq(stigmataImages.stigmataId, params.id),
            eq(stigmataImages.position, img.position)
          ))
          .get();

        if (existingImage && img.imgUrl !== undefined) {
          // Update existing image
          await tx.update(stigmataImages)
            .set({ imgUrl: img.imgUrl })
            .where(eq(stigmataImages.id, existingImage.id));
        } else if (!existingImage && img.imgUrl) {
          // Create new image
          await tx.insert(stigmataImages)
            .values({
              stigmataId: params.id,
              position: img.position,
              imgUrl: img.imgUrl,
            });
        }
      }
    }

    // Update set effects if provided
    if (body.setEffects) {
      const existingSetEffect = await tx.select()
        .from(stigmataSetEffects)
        .where(eq(stigmataSetEffects.stigmataId, params.id))
        .get();

      if (existingSetEffect) {
        // Only update fields that are provided (partial update)
        const setEffectsUpdateData: any = {};
        if (body.setEffects.setName !== undefined) setEffectsUpdateData.setName = body.setEffects.setName;
        if (body.setEffects.twoPieceName !== undefined) setEffectsUpdateData.twoPieceName = body.setEffects.twoPieceName;
        if (body.setEffects.twoPieceEffect !== undefined) setEffectsUpdateData.twoPieceEffect = body.setEffects.twoPieceEffect;
        if (body.setEffects.threePieceName !== undefined) setEffectsUpdateData.threePieceName = body.setEffects.threePieceName;
        if (body.setEffects.threePieceEffect !== undefined) setEffectsUpdateData.threePieceEffect = body.setEffects.threePieceEffect;

        if (Object.keys(setEffectsUpdateData).length > 0) {
          await tx.update(stigmataSetEffects)
            .set(setEffectsUpdateData)
            .where(eq(stigmataSetEffects.stigmataId, params.id));
        }
      } else {
        // Create new set effect
        await tx.insert(stigmataSetEffects)
          .values({
            stigmataId: params.id,
            setName: body.setEffects.setName || null,
            twoPieceName: body.setEffects.twoPieceName || null,
            twoPieceEffect: body.setEffects.twoPieceEffect || null,
            threePieceName: body.setEffects.threePieceName || null,
            threePieceEffect: body.setEffects.threePieceEffect || null,
          });
      }
    }

    return await tx.select().from(stigmata).where(eq(stigmata.id, params.id)).get();
  });
}

/**
 * Deletes a stigmata entry.
 * @param {Object} params.id - The ID of the stigmata to delete.
 * @returns {Object} The success message.
 */
export const deleteStigmata = async ({ params }: { params: { id: number } }) => {
  console.log('deleteStigmata called', params);

  await db.transaction(async (tx) => {
    // First, get all position IDs for this stigmata
    const positions = await tx.select({ id: stigmataPositions.id })
      .from(stigmataPositions)
      .where(eq(stigmataPositions.stigmataId, params.id));

    // Delete stats for each position
    for (const position of positions) {
      await tx.delete(stigmataStats).where(eq(stigmataStats.positionId, position.id));
    }

    // Delete positions
    await tx.delete(stigmataPositions).where(eq(stigmataPositions.stigmataId, params.id));

    // Delete images
    await tx.delete(stigmataImages).where(eq(stigmataImages.stigmataId, params.id));

    // Delete set effects
    await tx.delete(stigmataSetEffects).where(eq(stigmataSetEffects.stigmataId, params.id));

    // Finally, delete the main stigmata record
    await tx.delete(stigmata).where(eq(stigmata.id, params.id));

    // Reset auto-increment counters
    await tx.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('stigmata', 'stigmata_positions', 'stigmata_stats', 'stigmata_images', 'stigmata_set_effects')`);
  });

  return { success: true };
}

/**
 * Defines the routes for stigmata operations.
 */
export const stigmataRoutes = new Elysia({ prefix: '/api' })
  /**
   * GET /api/stigmata
   * Retrieves stigmata based on query parameters.
   */
  .get('/stigmata', getStigmata, {
    query: t.Object({
      id: t.Optional(t.Numeric()),
      name: t.Optional(t.String()),
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
    }),
  })
  /**
   * POST /api/stigmata
   * Creates a new stigmata entry. Requires authentication.
   */
  .post('/stigmata', ({ body, headers }) => {
    checkAuth({ headers })
    if (Array.isArray(body)) {
      return Promise.all(body.map(entry => postStigmata({ body: entry })))
    }
    return postStigmata({ body })
  }, {
    body: t.Union([
      t.Array(
        t.Object({
          name: t.String(),
          positions: t.Optional(t.Array(t.Object({
            position: t.String(),
            name: t.String(),
            skillName: t.String(),
            skillDescription: t.String(),
            stats: t.Object({
              hp: t.Optional(t.Number()),
              atk: t.Optional(t.Number()),
              def: t.Optional(t.Number()),
              crt: t.Optional(t.Number()),
              sp: t.Optional(t.Number()),
            }),
          }))),
          images: t.Array(t.Object({
            position: t.String(),
            imgUrl: t.String(),
          })),
          setEffects: t.Optional(t.Object({
            setName: t.Optional(t.String()),
            twoPieceName: t.Optional(t.String()),
            twoPieceEffect: t.Optional(t.String()),
            threePieceName: t.Optional(t.String()),
            threePieceEffect: t.Optional(t.String()),
          })),
        }))]),
    headers: t.Object({
      authorization: t.String()
    })
  })
  /**
   * PATCH /api/stigmata/:id
   * Updates an existing stigmata entry. Requires authentication.
   */
  .patch('/stigmata/:id', ({ params, body, headers }) => {
    checkAuth({ headers })
    return patchStigmata({ params, body })
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: t.Object({
      name: t.Optional(t.String()),
      positions: t.Optional(t.Array(t.Object({
        position: t.String(), // Required - tells us which position to update
        name: t.Optional(t.String()), // optional for partial updates
        skillName: t.Optional(t.String()),
        skillDescription: t.Optional(t.String()),
        stats: t.Optional(t.Object({
          hp: t.Optional(t.Number()),
          atk: t.Optional(t.Number()),
          def: t.Optional(t.Number()),
          crt: t.Optional(t.Number()),
          sp: t.Optional(t.Number()),
        })),
      }))),
      images: t.Optional(t.Array(t.Object({
        position: t.String(), // Required - tells us which position's image to update
        imgUrl: t.Optional(t.String()), // Optional - only update if provided
      }))),
      setEffects: t.Optional(t.Object({
        setName: t.Optional(t.String()),
        twoPieceName: t.Optional(t.String()),
        twoPieceEffect: t.Optional(t.String()),
        threePieceName: t.Optional(t.String()),
        threePieceEffect: t.Optional(t.String()),
      })),
    }),
    headers: t.Object({
      authorization: t.String()
    })
  })
  /**
  * DELETE /api/stigmata/:id
  * Deletes a stigmata entry. Requires authentication.
  */
  .delete('/stigmata/:id', ({ params, headers }) => {
    checkAuth({ headers })
    return deleteStigmata({ params })
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    headers: t.Object({
      authorization: t.String()
    })
  })

console.log('Stigmata routes loaded:', stigmataRoutes.routes.map(r => `${r.method} ${r.path}`))
