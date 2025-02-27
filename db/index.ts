import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as cities from 'db/schema/cities';
import * as districts from 'db/schema/districts';
import * as provinces from 'db/schema/provinces';
import * as subdistricts from 'db/schema/subdistricts';
import * as branches from 'db/schema/branches';
import * as categories from 'db/schema/categories';
import * as images from './schema/images';
import * as items from 'db/schema/items';
import * as orderedProducts from './schema/orderedProducts';
import * as orders from './schema/orders';
import * as productEmployeeAssignments from './schema/productEmployeeAssignments';
import * as productItems from 'db/schema/productsItems';
import * as products from './schema/products';
import * as itemMutations from 'db/schema/itemMutations';
import * as units from './schema/units';
import * as users from './schema/users';
import * as profiles from './schema/profiles';

const connection = new Database('sewapesta.db')
export const db = drizzle(connection, {
  schema: {
    ...provinces,
    ...cities,
    ...districts,
    ...subdistricts,
    ...branches,
    ...categories,
    ...products,
    ...images,
    ...items,
    ...orderedProducts,
    ...orders,
    ...productEmployeeAssignments,
    ...productItems,
    ...itemMutations,
    ...units,
    ...users,
    ...profiles,
    // ...vehicles,
  },
  logger: true,
})

