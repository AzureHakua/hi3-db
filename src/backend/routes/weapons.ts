
import { Elysia, t } from 'elysia'
import { db } from '../db'
import { weapon, weaponSkills, weaponImages } from '../db/schema'
import { eq, and, like } from 'drizzle-orm'
import { sql } from 'drizzle-orm';

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
 * Retrieves weapon based on the provided query parameters.
 * @param {Object} params.query - The query parameters.
 * @returns {Array} An array of weapon objects.
 */
export const getWeapon = async ({ query }: { query: any }) => {
  console.log('getWeapon called with query:', query)
  let weaponData;
  const limit = query.limit ? Number(query.limit) : 10; // Default to 10 if not specified

  if (query.name?.$like) {
    const searchTerm = query.name.$like.replace(/%/g, '');
    weaponData = await db.select()
      .from(weapon)
      .where(like(weapon.name, `%${searchTerm}%`))
      .limit(limit);
  } else if (query.name) {
    const searchTerm = query.name.replace(/\+/g, ' ');
    weaponData = await db.select()
      .from(weapon)
      .where(like(weapon.name, `%${searchTerm}%`))
      .limit(limit);
  } else if (query.id) {
    // If 'id' is provided, fetch the stigmata with the given ID
    weaponData = await db.select().from(weapon).where(eq(weapon.id, Number(query.id)));
  } else {
    // If no specific query parameters are provided, fetch all stigmata
    weaponData = await db.select().from(weapon).limit(limit).all();
  }

  // Fetch related data for each stigmata
  const fullData = await Promise.all(weaponData.map(async (s) => {

    const imagesData = await db.select().from(weaponImages).where(eq(weaponImages.weaponId, s.id));
    const skillsData = await db.select().from(weaponSkills).where(eq(weaponSkills.weaponId, s.id));

    return {
      ...s,
      images: imagesData,
      skills: skillsData,
    };
  }));

  return fullData;
}

/**
 * Creates a new weapon entry.
 * @param {Object} params.body - The request body.
 * @returns {Object} The created weapon object.
 */
export const postWeapon = async ({ body }: { body: any }) => {
  console.log('postWeapon called');
  if (!body.name) {
    throw new Error('Weapon name is required');
  }

  const newWeapon = await db.transaction(async (tx) => {
    const weaponResult = await tx.insert(weapon).values({
      name: body.name,
      atk: body.atk,
      crt: body.crt
    }).returning().get();

    if (body.images) {
      await tx.insert(weaponImages).values(body.images.map((img: any) => ({
        weaponId: weaponResult.id,
        ...img,
      })));
    }

    if (body.skills) {
      await tx.insert(weaponSkills).values(body.skills.map((skill: any) => ({
        weaponId: weaponResult.id,
        ...skill,
      })));
    }

    return weaponResult;
  });

  return newWeapon;
}

/**
 * Deletes a weapon entry.
 * @param {Object} params.id - The ID of the weapon to delete.
 * @returns {Object} The success message.
 */
export const deleteWeapon = async ({ params }: { params: { id: number } }) => {
  console.log('deleteStigmata called', params);
  await db.transaction(async (tx) => {
    await tx.delete(weaponSkills).where(eq(weaponSkills.weaponId, params.id));
    await tx.delete(weaponImages).where(eq(weaponImages.weaponId, params.id));
    await tx.delete(weapon).where(eq(weapon.id, params.id));
    await tx.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('weapon', 'weapon_images', 'weapon_skills')`);
  });
  return { success: true };
}

/**
 * Defines the routes for weapon operations.
 */
export const weaponRoutes = new Elysia({ prefix: '/api' })
  /**
   * GET /api/weapon
   * Retrieves weapon based on query parameters.
   */
  .get('/weapon', getWeapon, {
    query: t.Object({
      id: t.Optional(t.Numeric()),
      name: t.Optional(t.String()),
      limit: t.Optional(t.Numeric()),
    }),
  })
  /**
   * POST /api/weapon
   * Creates a new weapon entry. Requires authentication.
   */
  .post('/weapon', ({ body, headers }) => {
    checkAuth({ headers })
    if (Array.isArray(body)) {
      return Promise.all(body.map(entry => postWeapon({ body: entry })))
    }
    return postWeapon({ body })
  }, {
    body: t.Object({
      name: t.String(),
      atk: t.Number(),
      crt: t.Number(),
      images: t.Array(t.Object({
        baseUrl: t.Optional(t.String()),
        maxUrl: t.Optional(t.String()),
      })),
      skills: t.Array(t.Object({
        skillName: t.String(),
        skillDescription: t.String(),
      })),
    }),
    headers: t.Object({
      authorization: t.String()
    })
  })
  /**
  * DELETE /api/weapon/:id
  * Deletes a weapon entry. Requires authentication.
  */
  .delete('/weapon/:id', ({ params, headers }) => {
    checkAuth({ headers })
    return deleteWeapon({ params })
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    headers: t.Object({
      authorization: t.String()
    })
  })

console.log('Weapon routes loaded:', weaponRoutes.routes.map(r => `${r.method} ${r.path}`))