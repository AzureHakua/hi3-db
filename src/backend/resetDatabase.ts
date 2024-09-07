import { db } from './db';
import { stigmata, positions, stats, images, setEffects } from './db/schema';
import { sql } from 'drizzle-orm';

async function resetDatabase() {
  await db.delete(stats);
  await db.delete(positions);
  await db.delete(images);
  await db.delete(setEffects);
  await db.delete(stigmata);
  
  // Reset auto-increment counters
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('stigmata', 'positions', 'stats', 'images', 'set_effects')`);
  
  console.log('All data has been reset and auto-increment counters have been reset');
}

resetDatabase().catch(console.error);