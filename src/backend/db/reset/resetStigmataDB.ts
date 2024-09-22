import { db } from '..';
import { stigmata, stigmataPositions, stigmataStats, stigmataImages, stigmataSetEffects } from '../schema';
import { sql } from 'drizzle-orm';

async function resetDatabase() {
  await db.delete(stigmataStats);
  await db.delete(stigmataPositions);
  await db.delete(stigmataImages);
  await db.delete(stigmataSetEffects);
  await db.delete(stigmata);
  
  // Reset auto-increment counters
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('stigmata', 'positions', 'stats', 'images', 'set_effects')`);
  
  console.log('All data has been reset and auto-increment counters have been reset');
}

resetDatabase().catch(console.error);