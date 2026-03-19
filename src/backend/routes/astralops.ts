import { Elysia, t } from 'elysia'
import { db } from '../db'
import { astralop, astralOpSpecializations, astralOpSkills } from '../db/schema'
import { eq, like } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

const API_KEY = process.env.API_KEY

if (!API_KEY) {
  console.error('API_KEY is not set in environment variables')
  process.exit(1)
}

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
 * Retrieves astralop based on the provided query parameters.
 * @param {Object} params.query - The query parameters.
 * @returns {Array} An array of astralop objects.
 */
export const getAstralOp = async ({ query }: { query: any }) => {
  console.log('getAstralOp called with query:', query)
  let astralOpData;
  const limit = query.limit ? Number(query.limit) : 10;

  if (query.name?.$like) {
    const searchTerm = query.name.$like.replace(/%/g, '');
    astralOpData = await db.select()
      .from(astralop)
      .where(like(astralop.name, `%${searchTerm}%`))
      .limit(limit);
  } else if (query.name) {
    const searchTerm = query.name.replace(/\+/g, ' ');
    astralOpData = await db.select()
      .from(astralop)
      .where(like(astralop.name, `%${searchTerm}%`))
      .limit(limit);
  } else if (query.id) {
    astralOpData = await db.select().from(astralop).where(eq(astralop.id, Number(query.id)));
  } else {
    astralOpData = await db.select().from(astralop).limit(limit).all();
  }

  const fullData = await Promise.all(astralOpData.map(async (a) => {
    const specializationsData = await db.select()
      .from(astralOpSpecializations)
      .where(eq(astralOpSpecializations.astralOpId, a.id));

    const skillsData = await db.select()
      .from(astralOpSkills)
      .where(eq(astralOpSkills.astralOpId, a.id))
      .orderBy(astralOpSkills.skillOrder);

    // Group skills by category
    const skills = {
      synergy: skillsData.filter(s => s.category === 'synergy'),
      recharge: skillsData.filter(s => s.category === 'recharge'),
      passive: skillsData.filter(s => s.category === 'passive'),
    }

    return {
      ...a,
      specializations: specializationsData,
      skills,
    };
  }));

  return fullData;
}

/**
 * Creates a new astralop entry.
 * @param {Object} params.body - The request body.
 * @returns {Object} The created astralop object.
 */
export const postAstralOp = async ({ body }: { body: any }) => {
  console.log('postAstralOp called');
  if (!body.name) {
    throw new Error('AstralOp name is required');
  }

  const newAstralOp = await db.transaction(async (tx) => {
    const astralOpResult = await tx.insert(astralop).values({
      name: body.name,
      imgUrl: body.imgUrl,
      damage: body.damage,
    }).returning().get();

    if (body.specializations && body.specializations.length > 0) {
      await tx.insert(astralOpSpecializations).values(
        body.specializations.map((sp: any) => ({
          astralOpId: astralOpResult.id,
          spName: sp.spName,
          spTag: sp.spTag,
        }))
      );
    }

    if (body.skills) {
      const skillRows: any[] = [];
      for (const category of ['synergy', 'recharge', 'passive']) {
        if (body.skills[category]) {
          body.skills[category].forEach((skill: any, index: number) => {
            skillRows.push({
              astralOpId: astralOpResult.id,
              category,
              skillOrder: index + 1,
              skillName: skill.skillName,
              skillDescription: skill.skillDescription,
              unlock: skill.unlock,
              imgUrl: skill.imgUrl || null,
            });
          });
        }
      }
      if (skillRows.length > 0) {
        await tx.insert(astralOpSkills).values(skillRows);
      }
    }

    return astralOpResult;
  });

  return newAstralOp;
}


/**
 * Updates an existing astralop entry with partial updates.
 * @param {Object} params.body - The request body.
 * @returns {Object} The updated astralop object.
 */
export const patchAstralOp = async ({ params, body }: { params: { id: number }, body: any }) => {
  console.log('patchAstralOp called', params);

  return await db.transaction(async (tx) => {
    const astralOpResult = await tx.select().from(astralop).where(eq(astralop.id, params.id)).get();
    if (!astralOpResult) {
      throw new Error('AstralOp not found');
    }

    // Update core fields if provided
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.imgUrl !== undefined) updateData.imgUrl = body.imgUrl;
    if (body.damage !== undefined) updateData.damage = body.damage;

    if (Object.keys(updateData).length > 0) {
      await tx.update(astralop).set(updateData).where(eq(astralop.id, params.id));
    }

    // Update specializations if provided — replace all
    if (body.specializations !== undefined) {
      await tx.delete(astralOpSpecializations).where(eq(astralOpSpecializations.astralOpId, params.id));
      if (body.specializations.length > 0) {
        await tx.insert(astralOpSpecializations).values(
          body.specializations.map((sp: any) => ({
            astralOpId: params.id,
            spName: sp.spName,
            spTag: sp.spTag,
          }))
        );
      }
    }

    // Update individual skills if provided
    if (body.skills) {
      for (const category of ['synergy', 'recharge', 'passive']) {
        if (body.skills[category]) {
          for (const skill of body.skills[category]) {
            const existingSkill = await tx.select()
              .from(astralOpSkills)
              .where(eq(astralOpSkills.astralOpId, params.id))
              .all()
              .then(skills => skills.find(s => s.category === category && s.skillOrder === skill.skillOrder));

            if (existingSkill) {
              const skillUpdateData: any = {};
              if (skill.skillName !== undefined) skillUpdateData.skillName = skill.skillName;
              if (skill.skillDescription !== undefined) skillUpdateData.skillDescription = skill.skillDescription;
              if (skill.unlock !== undefined) skillUpdateData.unlock = skill.unlock;
              if (skill.imgUrl !== undefined) skillUpdateData.imgUrl = skill.imgUrl;

              if (Object.keys(skillUpdateData).length > 0) {
                await tx.update(astralOpSkills)
                  .set(skillUpdateData)
                  .where(eq(astralOpSkills.id, existingSkill.id));
              }
            }
          }
        }
      }
    }

    return await tx.select().from(astralop).where(eq(astralop.id, params.id)).get();
  });
}

/**
 * Deletes a stigmata entry.
 * @param {Object} params.id - The ID of the stigmata to delete.
 * @returns {Object} The success message.
 */
export const deleteAstralOp = async ({ params }: { params: { id: number } }) => {
  console.log('deleteAstralOp called', params);

  await db.transaction(async (tx) => {
    await tx.delete(astralOpSkills).where(eq(astralOpSkills.astralOpId, params.id));
    await tx.delete(astralOpSpecializations).where(eq(astralOpSpecializations.astralOpId, params.id));
    await tx.delete(astralop).where(eq(astralop.id, params.id));
    await tx.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('astralop', 'astralop_specializations', 'astralop_skills')`);
  });

  return { success: true };
}

/**
 * Defines the routes for astralop operations.
 */
export const astralOpRoutes = new Elysia({ prefix: '/api' })
  /**
   * GET /api/astralop
   * Retrieves stigmata based on query parameters.
   */
  .get('/astralop', getAstralOp, {
    query: t.Object({
      id: t.Optional(t.Numeric()),
      name: t.Optional(t.String()),
      limit: t.Optional(t.Numeric()),
    }),
  })
  /**
   * POST /api/astralop
   * Creates a new stigmata entry. Requires authentication.
   */
  .post('/astralop', ({ body, headers }) => {
    checkAuth({ headers })
    if (Array.isArray(body)) {
      return Promise.all(body.map(entry => postAstralOp({ body: entry })))
    }
    return postAstralOp({ body })
  }, {
    body: t.Object({
      name: t.String(),
      imgUrl: t.Optional(t.String()),
      damage: t.String(),
      specializations: t.Optional(t.Array(t.Object({
        spName: t.String(),
        spTag: t.String(),
      }))),
      skills: t.Optional(t.Object({
        synergy: t.Optional(t.Array(t.Object({
          skillName: t.String(),
          skillDescription: t.String(),
          unlock: t.String(),
          imgUrl: t.Optional(t.String()),
        }))),
        recharge: t.Optional(t.Array(t.Object({
          skillName: t.String(),
          skillDescription: t.String(),
          unlock: t.String(),
          imgUrl: t.Optional(t.String()),
        }))),
        passive: t.Optional(t.Array(t.Object({
          skillName: t.String(),
          skillDescription: t.String(),
          unlock: t.String(),
          imgUrl: t.Optional(t.String()),
        }))),
      })),
    }),
    headers: t.Object({
      authorization: t.String()
    })
  })
  /**
   * PATCH /api/astralop/:id
   * Updates an existing astralop entry. Requires authentication.
   */
  .patch('/astralop/:id', ({ params, body, headers }) => {
    checkAuth({ headers })
    return patchAstralOp({ params, body })
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: t.Object({
      name: t.Optional(t.String()),
      imgUrl: t.Optional(t.String()),
      damage: t.Optional(t.String()),
      specializations: t.Optional(t.Array(t.Object({
        spName: t.String(),
        spTag: t.String(),
      }))),
      skills: t.Optional(t.Object({
        synergy: t.Optional(t.Array(t.Object({
          skillOrder: t.Number(),
          skillName: t.Optional(t.String()),
          skillDescription: t.Optional(t.String()),
          unlock: t.Optional(t.String()),
          imgUrl: t.Optional(t.String()),
        }))),
        recharge: t.Optional(t.Array(t.Object({
          skillOrder: t.Number(),
          skillName: t.Optional(t.String()),
          skillDescription: t.Optional(t.String()),
          unlock: t.Optional(t.String()),
          imgUrl: t.Optional(t.String()),
        }))),
        passive: t.Optional(t.Array(t.Object({
          skillOrder: t.Number(),
          skillName: t.Optional(t.String()),
          skillDescription: t.Optional(t.String()),
          unlock: t.Optional(t.String()),
          imgUrl: t.Optional(t.String()),
        }))),
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
  .delete('/astralop/:id', ({ params, headers }) => {
    checkAuth({ headers })
    return deleteAstralOp({ params })
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    headers: t.Object({
      authorization: t.String()
    })
  })

console.log('AstralOp routes loaded:', astralOpRoutes.routes.map(r => `${r.method} ${r.path}`))
