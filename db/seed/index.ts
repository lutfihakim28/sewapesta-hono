import { seedBranches } from 'db/seed/branch.seed';
import { seedCategories } from 'db/seed/category.seed';
import { seedCities } from 'db/seed/cities.seed';
import { seedDistricts } from 'db/seed/districts.seed';
import { seedEmployees } from 'db/seed/employee.seed';
import { seedItems } from 'db/seed/item.seed';
import { seedOrders } from 'db/seed/order.seed';
import { seedOwners } from 'db/seed/owner.seed';
import { seedPermissions } from 'db/seed/permission.seed';
import { seedProvinces } from 'db/seed/provinces.seed';
import { seedRoles } from 'db/seed/role.seed';
import { seedSubdistricts } from 'db/seed/subdistricts.seed';
import { seedUnits } from 'db/seed/unit.seed';
import { seedUsers } from 'db/seed/user.seed';
import { seedVehicles } from 'db/seed/vehicle.seed';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { seed } from 'drizzle-seed';

await seedProvinces()
await seedCities()
await seedDistricts()
await seedSubdistricts()

await seedBranches()
await seedPermissions()
await seedRoles()
await seedUsers()

await seedCategories()
await seedEmployees()
await seedOwners()
await seedUnits()
// await seedItems()
await seedVehicles()
// await seedOrders()