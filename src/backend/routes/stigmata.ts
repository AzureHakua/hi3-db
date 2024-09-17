import { Elysia, t } from 'elysia'
import { db } from '../db'
import { stigmata, positions, stats, images, setEffects, InsertStigmata } from '../db/schema'
import { eq, and, like } from 'drizzle-orm'

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
export const getStigmata = async ({ query }: { query: any }) => {
  console.log('getStigmata called with query:', query)
  let stigmataData;
  const limit = query.limit ? Number(query.limit) : 10; // Default to 10 if not specified

  if (query.name?.$like) {
    const searchTerm = query.name.$like.replace(/%/g, '');
    stigmataData = await db.select()
      .from(stigmata)
      .where(like(stigmata.name, `%${searchTerm}%`))
      .limit(limit);
  } else if (query.name) { 
    const searchTerm = query.name.replace(/\+/g, ' ');
    stigmataData = await db.select()
      .from(stigmata)
      .where(like(stigmata.name, `%${searchTerm}%`))
      .limit(limit);
  } else if (query.id) {
    // If 'id' is provided, fetch the stigmata with the given ID
    stigmataData = await db.select().from(stigmata).where(eq(stigmata.id, Number(query.id)));
  } else {
    // If no specific query parameters are provided, fetch all stigmata
    stigmataData = await db.select().from(stigmata).limit(limit).all();
  }

  // Fetch related data for each stigmata
  const fullData = await Promise.all(stigmataData.map(async (s) => {
    let positionsData = await db.select().from(positions).where(eq(positions.stigmataId, s.id));

    const positionsWithStats = await Promise.all(positionsData.map(async (p) => {
      const statsData = await db.select().from(stats).where(eq(stats.positionId, p.id));
      return { ...p, stats: statsData[0] };
    }));

    const imagesData = await db.select().from(images).where(eq(images.stigmataId, s.id));
    const setEffectsData = await db.select().from(setEffects).where(eq(setEffects.stigmataId, s.id));

    return {
      ...s,
      positions: positionsWithStats,
      images: imagesData,
      setEffects: setEffectsData[0],
    };
  }));

  return fullData;
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
        const positionResult = await tx.insert(positions).values({
          stigmataId: stigmataResult.id,
          position: pos.position,
          name: pos.name,
          skillName: pos.skillName,
          skillDescription: pos.skillDescription,
        }).returning().get();

        if (pos.stats) {
          await tx.insert(stats).values({
            positionId: positionResult.id,
            ...pos.stats,
          });
        }
      }
    }

    if (body.images) {
      await tx.insert(images).values(body.images.map((img: any) => ({
        stigmataId: stigmataResult.id,
        ...img,
      })));
    }

    if (body.setEffects) {
      await tx.insert(setEffects).values({
        stigmataId: stigmataResult.id,
        ...body.setEffects,
      });
    }

    return stigmataResult;
  });

  return newStigma;
}


/**
 * Updates an existing stigmata entry.
 * @param {Object} params.body - The request body.
 * @returns {Object} The updated stigmata object.
 */
export const patchStigmata = async ({ params, body }: { params: { id: number }, body: any }) => {
  console.log('patchStigmata called', params);
  // Check if the stigmata exists
  return await db.transaction(async (tx) => {
    const stigmataResult = await tx.select().from(stigmata).where(eq(stigmata.id, params.id)).get();
    if (!stigmataResult) {
      throw new Error('Stigmata not found');
    }

    if (body.name) {
      await tx.update(stigmata).set({ name: body.name }).where(eq(stigmata.id, params.id));
    }

    if (body.positions) {
      const positionsToUpdate = Array.isArray(body.positions) ? body.positions : [body.positions];

      for (const pos of positionsToUpdate) {
        const existingPosition = await tx.select()
          .from(positions)
          .where(and(
            eq(positions.stigmataId, params.id),
            eq(positions.position, pos.position)
          ))
          .get();

        if (existingPosition) {
          await tx.update(positions)
            .set({
              name: pos.name,
              skillName: pos.skill_name,
              skillDescription: pos.skill_description,
            })
            .where(eq(positions.id, existingPosition.id));

          if (pos.stats) {
            await tx.update(stats)
              .set({
                hp: Number(pos.stats.HP),
                atk: Number(pos.stats.ATK),
                def: Number(pos.stats.DEF),
                crt: Number(pos.stats.CRT),
                sp: Number(pos.stats.SP),
              })
              .where(eq(stats.positionId, existingPosition.id));
          }
        } else {
          const newPosition = await tx.insert(positions)
            .values({
              stigmataId: params.id,
              position: pos.position,
              name: pos.name,
              skillName: pos.skill_name,
              skillDescription: pos.skill_description,
            })
            .returning()
            .get();

          if (pos.stats) {
            await tx.insert(stats)
              .values({
                positionId: newPosition.id,
                hp: Number(pos.stats.HP),
                atk: Number(pos.stats.ATK),
                def: Number(pos.stats.DEF),
                crt: Number(pos.stats.CRT),
                sp: Number(pos.stats.SP),
              });
          }
        }
      }
    }

    if (body.images) {
      const imagesToUpdate = Array.isArray(body.images) ? body.images : [body.images];

      for (const img of imagesToUpdate) {
        await tx.delete(images)
          .where(and(
            eq(images.stigmataId, params.id),
            eq(images.position, img.position)
          ));

        await tx.insert(images)
          .values({
            stigmataId: params.id,
            position: img.position,
            iconUrl: img.icon,
            bigUrl: img.big,
          });
      }
    }

    if (body.set) {
      await tx.update(setEffects)
        .set({
          setName: body.set.name,
          twoPieceName: body.set["2_piece"]?.name,
          twoPieceEffect: body.set["2_piece"]?.effect,
          threePieceName: body.set["3_piece"]?.name,
          threePieceEffect: body.set["3_piece"]?.effect,
        })
        .where(eq(setEffects.stigmataId, params.id));
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
    await tx.delete(stats).where(eq(stats.positionId, tx.select({ id: positions.id }).from(positions).where(eq(positions.stigmataId, params.id))));
    await tx.delete(positions).where(eq(positions.stigmataId, params.id));
    await tx.delete(images).where(eq(images.stigmataId, params.id));
    await tx.delete(setEffects).where(eq(setEffects.stigmataId, params.id));
    await tx.delete(stigmata).where(eq(stigmata.id, params.id));
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
    }),
  })
  /**
   * POST /api/stigmata
   * Creates a new stigmata entry. Requires authentication.
   */
  .post('/stigmata', ({ body, headers }) => {
    checkAuth({ headers })
    return postStigmata({ body })
  }, {
    body: t.Object({
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
        iconUrl: t.String(),
        bigUrl: t.String(),
      })),
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
        id: t.Optional(t.Number()),
        position: t.String(),
        name: t.String(),
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
        position: t.String(),
        iconUrl: t.Optional(t.String()),
        bigUrl: t.Optional(t.String()),
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