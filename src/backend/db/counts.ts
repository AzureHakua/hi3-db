import { db } from "."
import { valkyrie, weapon, stigmata, astralop } from "./schema"
import { sql } from "drizzle-orm"

export const getEntityCounts = async () => {
  const [valkyrieCount, weaponCount, stigmataCount, astralOpCount] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(valkyrie)
      .get(),
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

  return { valkyrieCount, weaponCount, stigmataCount, astralOpCount }
}
