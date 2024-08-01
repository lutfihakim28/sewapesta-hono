import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as categories from './schema/categories';
import * as employees from './schema/employees';
import * as images from './schema/images';
import * as items from './schema/items';
import * as orderedPackages from './schema/orderedPackages';
import * as orders from './schema/orders';
import * as owners from './schema/owners';
import * as packageItems from './schema/packageItems';
import * as packages from './schema/packages';
import * as units from './schema/units';
import * as users from './schema/users';
import * as vehicles from './schema/vehicles';

const connection = new Database('sewapesta.db')
export const db = drizzle(connection, {
  schema: {
    ...categories,
    ...employees,
    ...images,
    ...items,
    ...orderedPackages,
    ...orders,
    ...owners,
    ...packageItems,
    ...packages,
    ...units,
    ...users,
    ...vehicles,
  },
})