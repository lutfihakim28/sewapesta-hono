import { logger } from '@/lib/utils/logger';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const connection = new Database('sewapesta.db')
export const db = drizzle(connection, {
  logger: {
    logQuery: (query, params) => {
      logger.info({ sql: query, params }, 'Executing SQL Query');
    },
  },
})

