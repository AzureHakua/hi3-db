import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { swagger } from '@elysiajs/swagger'
import { db } from './db';
import { eq, and } from 'drizzle-orm';
import { stigmata, SelectStigmata } from './db/schema';

new Elysia()
  .use(html())
  .use(swagger())
  .get('/', () => (
    <html lang="en">
      <head>
        <title>Hi~ Elysia</title>
        <script src="https://unpkg.com/htmx.org@2.0.2"></script>
      </head>
      <body
        hx-get='/stigmata'
        hx-trigger='load'
        hx-swap='innerHTML'
      />
    </html>
  ))

  /**
   * GET /stigmata
   * Handles requests for stigmata data by various combinations of fields.
   * 
   * @param {number} [id] - The stigmata ID.
   * @param {string} [name] - The stigmata name.
   * @param {string} [pos] - The stigmata position.
   * @param {string} [eff] - The stigmata effect.
   * @param {string} [p2] - The 2-piece bonus.
   * @param {string} [p3] - The 3-piece bonus.
   * @returns {Promise<JSX.Element>} A JSX element rendering the stigmata data.
   */
  .get('/stigmata', async ({ query }) => {
    let data;

    if (query.id) {
        // Query by ID
        data = await db.select().from(stigmata).where(eq(stigmata.id, Number(query.id)));
    } else if (query.name && query.pos) {
        // Query by name and position
        data = await db.select().from(stigmata).where(and(eq(stigmata.name, query.name), eq(stigmata.pos, query.pos)));
    } else if (query.name) {
        data = await db.select().from(stigmata).where(eq(stigmata.name, query.name));
    } else {
        data = await db.select().from(stigmata).all();
    }

    return <StigmataList stigmata={data} />;

  }, {
    query: t.Object({
      id: t.Optional(t.Numeric()),   // Optional query parameter for ID
      name: t.Optional(t.String()),  // Optional query parameter for name
      pos: t.Optional(t.String()),   // Optional query parameter for position
      eff: t.Optional(t.String()),   // Optional query parameter for effect
      p2: t.Optional(t.String()),    // Optional query parameter for 2-piece bonus
      p3: t.Optional(t.String()),    // Optional query parameter for 3-piece bonus
    }),
  })


  /**
   * POST /stigmata
   * Creates a new stigmata record.
   * 
   * @param {Object} body - The stigmata data.
   */
  .post('/stigmata', async ({ body }) => {
    if (body.name.length === 0)   {
      throw new Error('Content cannot be empty');
    }
    const newStigma = await db.insert(stigmata).values(body).returning().get();
    return <StigmaSingle { ... newStigma } />;
  }, {
      body: t.Object({
        name: t.String(),
        img: t.String(),
        pos: t.String(),
        eff: t.String(),
        p2: t.String(),
        p3: t.String(),
      })
  })


  /**
   * PATCH /stigmata/:id
   * Updates an existing stigma record by ID.
   * 
   * @param {number} id - The ID of the stigmata to update.
   * @param {Object} body - The updated stigmata data.
   */
  .patch('/stigmata/:id', async ({ params, body }) => {
    const updatedStigma = await db.update(stigmata).set(body).where(eq(stigmata.id, params.id)).returning().get();
    return <StigmaSingle { ...updatedStigma } />;
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
    })
  })


  /**
   * DELETE /stigmata/:id
   * Deletes a stigmata record by ID.
   * 
   * @param {number} id - The stigmata ID.
   */
  .delete('/stigmata/:id', async ({ params }) => {
    await db.delete(stigmata).where(eq(stigmata.id, params.id)).run();
  }, {
      params: t.Object({
        id: t.Numeric(),
      })
  })

  .listen(3000)


function StigmaSingle({ name, pos, id }: SelectStigmata) {
  return (
    <div>
      <p>{name} : {pos} : {id}</p>
    </div>
  )
}


function StigmataList({ stigmata }: { stigmata: SelectStigmata[] }) {
  return (
    <div>
      {stigmata.map((stigma) => (
        <StigmaSingle {...stigma} />
      ))}
    </div>
  );
}