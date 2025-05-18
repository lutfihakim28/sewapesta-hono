import { pinoLogger } from '@/utils/helpers/logger';
import { Database } from 'bun:sqlite';

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = Bun.env.DB_URL

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, {
  logger: {
    logQuery: (query, params) => {
      if (query.toLowerCase().includes('create table')) return;
      if (query.toLowerCase().includes('create index')) return;
      if (query.toLowerCase().includes('create unique index')) return;
      if (query.toLowerCase().includes('insert into "provinces"')) return;
      if (query.toLowerCase().includes('insert into "cities"')) return;
      if (query.toLowerCase().includes('insert into "districts"')) return;
      if (query.toLowerCase().includes('insert into "subdistricts"')) return;
      pinoLogger.info({ sql: query, params }, 'Executing SQL Query');
    },
  },
})

