import { db } from '..';
import { weapon, weaponImages, weaponSkills } from '../schema';
import { sql } from 'drizzle-orm';

async function resetDatabase() {
  await db.delete(weaponImages);
  await db.delete(weaponSkills);
  await db.delete(weapon);
  
  // Reset auto-increment counters
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('weapon', 'images', 'skills')`);
  
  console.log('All data has been reset and auto-increment counters have been reset');
}

resetDatabase().catch(console.error);