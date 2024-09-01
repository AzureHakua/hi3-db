import { Elysia, t } from 'elysia'
import { db } from '../db'
import { stigmata, SelectStigmata, InsertStigmata } from '../db/schema'
import { eq, and } from 'drizzle-orm'

export const getStigmata = async ({ query }: { query: any }): Promise<SelectStigmata[]> => {
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
  if (body.name.length === 0 || body.pos.length === 0) {
    throw new Error('Content cannot be empty');
  }
  const newStigma = await db.insert(stigmata).values(body).returning().get();
  return newStigma;
}

export const patchStigmata = async ({ params, body }: { params: { id: number }, body: Partial<InsertStigmata> }): Promise<SelectStigmata> => {
  const updatedStigma = await db.update(stigmata).set(body).where(eq(stigmata.id, params.id)).returning().get();
  return updatedStigma;
}

export const deleteStigmata = async ({ params }: { params: { id: number } }): Promise<{ success: boolean }> => {
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
  .post('/stigmata', postStigmata, {
    body: t.Object({
      name: t.String(),
      img: t.String(),
      pos: t.String(),
      eff: t.String(),
      p2: t.String(),
      p3: t.String(),
    })
  })
  .patch('/stigmata/:id', patchStigmata, {
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
    })
  })
  .delete('/stigmata/:id', deleteStigmata, {
    params: t.Object({
      id: t.Numeric(),
    })
  });