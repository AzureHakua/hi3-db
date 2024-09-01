import { Elysia, t } from 'elysia'
import { db } from '../db'
import { stigmata, SelectStigmata, InsertStigmata } from '../db/schema'
import { eq, and } from 'drizzle-orm'

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
 * Retrieves stigmata based on the provided query parameters.
 * @param {Object} params - The parameters object.
 * @param {Object} params.query - The query parameters for filtering stigmata.
 * @returns {Promise<SelectStigmata[]>} A promise that resolves to an array of stigmata.
 */
export const getStigmata = async ({ query }: { query: any }): Promise<SelectStigmata[]> => {
  console.log('getStigmata called with query:', query)
  let data;

  if (query.id) {
    data = await db.select().from(stigmata).where(eq(stigmata.id, Number(query.id)));
  } else if (query.name && query.pos) {
    data = await db.select().from(stigmata).where(and(eq(stigmata.name, query.name), eq(stigmata.pos, query.pos)));
  } else if (query.name) {
    data = await db.select().from(stigmata).where(eq(stigmata.name, query.name));
  } else {
    data = await db.select().from(stigmata).all();
  }

  return data;
}


/**
 * Creates a new stigmata entry.
 * @param {Object} params - The parameters object.
 * @param {InsertStigmata} params.body - The stigmata data to insert.
 * @returns {Promise<SelectStigmata>} A promise that resolves to the created stigmata.
 */
export const postStigmata = async ({ body }: { body: InsertStigmata }): Promise<SelectStigmata> => {
  console.log('postStigmata called');
  if (body.name.length === 0 || body.pos.length === 0) {
    throw new Error('Content cannot be empty');
  }
  const newStigma = await db.insert(stigmata).values(body).returning().get();
  return newStigma;
}


/**
 * Updates an existing stigmata entry.
 * @param {Object} params - The parameters object.
 * @param {number} params.params.id - The ID of the stigmata to update.
 * @param {Partial<InsertStigmata>} params.body - The updated stigmata data.
 * @returns {Promise<SelectStigmata>} A promise that resolves to the updated stigmata.
 */
export const patchStigmata = async ({ params, body }: { params: { id: number }, body: Partial<InsertStigmata> }): Promise<SelectStigmata> => {
  console.log('patchStigmata called', params);
  const updatedStigma = await db.update(stigmata).set(body).where(eq(stigmata.id, params.id)).returning().get();
  return updatedStigma;
}


/**
 * Deletes a stigmata entry.
 * @param {Object} params - The parameters object.
 * @param {number} params.params.id - The ID of the stigmata to delete.
 * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating the success of the operation.
 */
export const deleteStigmata = async ({ params }: { params: { id: number } }): Promise<{ success: boolean }> => {
  console.log('deleteStigmata called', params);
  await db.delete(stigmata).where(eq(stigmata.id, params.id)).run();
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
      pos: t.Optional(t.String()),
      eff: t.Optional(t.String()),
      p2: t.Optional(t.String()),
      p3: t.Optional(t.String()),
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
      img: t.String(),
      pos: t.String(),
      eff: t.String(),
      p2: t.String(),
      p3: t.String(),
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
      img: t.Optional(t.String()),
      pos: t.Optional(t.String()),
      eff: t.Optional(t.String()),
      p2: t.Optional(t.String()),
      p3: t.Optional(t.String()),
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