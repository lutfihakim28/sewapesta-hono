import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite'

const connection = new Database('sewapesta.db')
export const db = drizzle(connection, {
  logger: true,
})

