import { db } from "."
import { weapon, stigmata, astralop } from "./schema"
import { sql } from "drizzle-orm"

export const getEntityCounts = async () => {
  const [weaponCount, stigmataCount, astralOpCount] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(weapon)
      .get(),
    db
      .select({ count: sql<number>`count(*)` })
      .from(stigmata)
      .get(),
    db
      .select({ count: sql<number>`count(*)` })
      .from(astralop)
      .get(),
  ])

  return { weaponCount, stigmataCount, astralOpCount }
}
