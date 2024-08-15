import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as categories from './schema/categories';
import * as employees from './schema/employees';
import * as images from './schema/images';
import * as items from './schema/items';
import * as orderedProducts from './schema/orderedProducts';
import * as orders from './schema/orders';
import * as owners from './schema/owners';
import * as productEmployeeAssignments from './schema/productEmployeeAssignments';
import * as productItems from './schema/productItems';
import * as products from './schema/products';
import * as stockMutations from './schema/stockMutations';
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
    ...orderedProducts,
    ...orders,
    ...owners,
    ...productEmployeeAssignments,
    ...productItems,
    ...products,
    ...stockMutations,
    ...units,
    ...users,
    ...vehicles,
  },
})