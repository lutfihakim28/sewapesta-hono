import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as accountMutations from './schema/accountMutations';
import * as accounts from './schema/accounts';
import * as categories from './schema/categories';
import * as damagedItems from './schema/damagedItems';
import * as employees from './schema/employees';
import * as events from './schema/events';
import * as images from './schema/images';
import * as items from './schema/items';
import * as orderedItems from './schema/orderedItems';
import * as orders from './schema/orders';
import * as owners from './schema/owners';
import * as payments from './schema/payments';
import * as subcategories from './schema/subcategories';
import * as units from './schema/units';
import * as users from './schema/users';
import * as vehicles from './schema/vehicles';

const connection = new Database('sewapesta.db')
export const db = drizzle(connection, {
  schema: {
    ...accountMutations,
    ...accounts,
    ...categories,
    ...damagedItems,
    ...employees,
    ...events,
    ...images,
    ...items,
    ...orderedItems,
    ...orders,
    ...owners,
    ...payments,
    ...subcategories,
    ...units,
    ...users,
    ...vehicles,
  },
})