import { logger } from '@/lib/utils/logger';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const connection = new Database('sewapesta.db')
export const db = drizzle(connection, {
  logger: {
    logQuery: (query, params) => {
      if (query.toLowerCase().includes('create table')) return;
      if (query.toLowerCase().includes('create index')) return;
      if (query.toLowerCase().includes('create unique index')) return;
      if (query.toLowerCase().includes('insert into \"provinces\"')) return;
      if (query.toLowerCase().includes('insert into \"cities\"')) return;
      if (query.toLowerCase().includes('insert into \"districts\"')) return;
      if (query.toLowerCase().includes('insert into \"subdistricts\"')) return;
      logger.info({ sql: query, params }, 'Executing SQL Query');
    },
  },
})

