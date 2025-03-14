import { logger } from '@/lib/utils/logger';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createPool({
  host: Bun.env.DB_HOST,
  user: Bun.env.DB_USER,
  password: Bun.env.DB_PASSWORD,
  database: Bun.env.DB_DATABASE,
});

export const db = drizzle(connection, {
  logger: {
    logQuery: (query, params) => {
      logger.info({ sql: query, params }, 'Executing SQL Query');
    },
  },
})

