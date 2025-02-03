import { Database } from 'bun:sqlite';
import * as cities from 'db/schema/cities';
import * as districts from 'db/schema/districts';
import * as provinces from 'db/schema/provinces';
import * as subdistricts from 'db/schema/subdistricts';
import * as roles from 'db/schema/roles';
import * as rolesPermissions from 'db/schema/rolesPermissions';
import * as permissions from 'db/schema/permissions';
import * as branches from 'db/schema/branches';
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as categories from 'db/schema/categories';
import * as employees from './schema/employees';
import * as images from './schema/images';
import * as items from 'db/schema/items';
import * as orderedProducts from './schema/orderedProducts';
import * as orders from './schema/orders';
import * as owners from './schema/owners';
import * as productEmployeeAssignments from './schema/productEmployeeAssignments';
import * as productItems from 'db/schema/productsItems';
import * as products from './schema/products';
import * as stockMutations from 'db/schema/itemMutations';
import * as units from './schema/units';
import * as users from './schema/users';
import * as vehicles from './schema/vehicles';

const connection = new Database('sewapesta.db')
export const db = drizzle(connection, {
  schema: {
    ...provinces,
    ...cities,
    ...districts,
    ...subdistricts,
    ...roles,
    ...rolesPermissions,
    ...permissions,
    ...branches,
    ...categories,
    ...employees,
    ...products,
    ...images,
    ...items,
    ...orderedProducts,
    ...orders,
    ...owners,
    ...productEmployeeAssignments,
    ...productItems,
    ...stockMutations,
    ...units,
    ...users,
    ...vehicles,
  },
})