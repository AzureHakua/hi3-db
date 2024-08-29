import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { swagger } from '@elysiajs/swagger'
import { db } from './db';
import { stigmata, InsertStigmata, SelectStigmata } from './db/schema';

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
  .get('/stigmata', async () => {
    const data = (await db.select().from(stigmata).all());
    return <StigmataList stigmata={data} />;
  })
  .post('/stigmata', async ({ body }) => {
    if (body.name.length === 0)   {
      throw new Error('Content cannot be empty');
    }
    const newStigma = await db.insert(stigmata).values(body).returning().get();
    return <StigmaSingle { ... newStigma } />;
  },
  {
    body: t.Object({
      name: t.String(),
      img: t.String(),
      pos: t.String(),
      eff: t.String(),
      p2: t.String(),
      p3: t.String(),
    }),
  })
  .listen(3000)

// type Stigma = {
//     id: number,
//     name: string,
//     img: string,
//     pos: string,
//     eff: string,
//     p2: string,
//     p3: string
// }

// const dbs: Stigma[] = [
//     { id: 1, name: 'Bianka: Theater', img: 'N/A', pos: 'Top', eff: 'Effect Text Here', p2: '2-piece: Effect', p3: '3-piece: Effect' },
//     { id: 2, name: 'Bianka: Theater', img: 'N/A', pos: 'Middle', eff: 'Effect Text Here', p2: '2-piece: Effect', p3: '2-piece: Effect' }
// ];

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