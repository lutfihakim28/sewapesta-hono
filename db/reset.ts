import { db } from 'db';
import { sql } from 'drizzle-orm';

async function resetDB() {
  await db.execute(sql`DROP DATABASE sewapesta`);
  await db.execute(sql`CREATE DATABASE sewapesta`);

  await db.$client.end()
}

resetDB()
  .then(() => console.log('DB reset'))
  .catch((e) => console.log(e))