import { db } from "../../db"
import { character } from "../../db/schema"
import { eq, asc } from "drizzle-orm"

export const getCharacter = async () => {
  return await db.select().from(character).orderBy(asc(character.name)).all()
}

export const postCharacter = async ({ body }: { body: any }) => {
  if (!body.name) throw new Error("Character name is required")

  const existing = await db.select().from(character).where(eq(character.name, body.name)).get()
  if (existing) throw new Error(`Character "${body.name}" already exists`)

  return await db.insert(character).values({ name: body.name }).returning().get()
}
