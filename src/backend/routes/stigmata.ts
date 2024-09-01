import { Elysia, t } from 'elysia'
import { db } from '../db'
import { stigmata, SelectStigmata, InsertStigmata } from '../db/schema'
import { eq, and } from 'drizzle-orm'

const API_KEY = process.env.API_KEY

if (!API_KEY) {
  console.error('API_KEY is not set in environment variables')
  process.exit(1)
}

const checkAuth = ({ headers }: { headers: { authorization: string } }) => {
  if (!headers.authorization || !headers.authorization.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header')
  }
  const token = headers.authorization.split(' ')[1]
  if (token !== API_KEY) {
    throw new Error('Invalid API key')
  }
}

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

export const postStigmata = async ({ body }: { body: InsertStigmata }): Promise<SelectStigmata> => {
  console.log('postStigmata called');
  if (body.name.length === 0 || body.pos.length === 0) {
    throw new Error('Content cannot be empty');
  }
  const newStigma = await db.insert(stigmata).values(body).returning().get();
  return newStigma;
}

export const patchStigmata = async ({ params, body }: { params: { id: number }, body: Partial<InsertStigmata> }): Promise<SelectStigmata> => {
  console.log('patchStigmata called', params);
  const updatedStigma = await db.update(stigmata).set(body).where(eq(stigmata.id, params.id)).returning().get();
  return updatedStigma;
}

export const deleteStigmata = async ({ params }: { params: { id: number } }): Promise<{ success: boolean }> => {
  console.log('deleteStigmata called', params);
  await db.delete(stigmata).where(eq(stigmata.id, params.id)).run();
  return { success: true };
}

export const stigmataRoutes = new Elysia({ prefix: '/api' })
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