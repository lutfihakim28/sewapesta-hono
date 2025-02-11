import { db } from 'db';
import { seedBranches } from 'db/seed/branch.seed';
import { seedCategories } from 'db/seed/category.seed';
import { seedCities } from 'db/seed/cities.seed';
import { seedDistricts } from 'db/seed/districts.seed';
import { seedItems } from 'db/seed/item.seed';
import { seedOrders } from 'db/seed/order.seed';
import { seedPermissions } from 'db/seed/permission.seed';
import { seedProvinces } from 'db/seed/provinces.seed';
import { seedRoles } from 'db/seed/role.seed';
import { seedSubdistricts } from 'db/seed/subdistricts.seed';
import { seedUnits } from 'db/seed/unit.seed';
import { seedUsers } from 'db/seed/user.seed';
import { seedVehicles } from 'db/seed/vehicle.seed';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

await seedProvinces()
await seedCities()
await seedDistricts()
await seedSubdistricts()

await seedBranches()
await seedPermissions()
await seedRoles()
// await seedUsers()

await seedCategories()
await seedUnits()
// await seedItems()
await seedVehicles()
// await seedOrders()