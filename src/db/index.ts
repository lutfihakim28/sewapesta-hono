import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as accounts from './schema/accounts';
import * as categories from './schema/categories';
import * as employees from './schema/employees';
import * as items from './schema/items';
import * as owners from './schema/owners';
import * as subcategories from './schema/subcategories';
import * as users from './schema/users';

const connection = new Database('sewapesta.db')
export const db = drizzle(connection, {
  schema: {
    ...accounts,
    ...categories,
    ...employees,
    ...items,
    ...owners,
    ...subcategories,
    ...users,
  },
})