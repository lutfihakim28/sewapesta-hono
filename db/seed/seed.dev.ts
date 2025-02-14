import { db } from 'db';
import { seedBranches } from 'db/seed/branch.seed';
import { seedCategories } from 'db/seed/category.seed';
import { seedCities } from 'db/seed/cities.seed';
import { seedDistricts } from 'db/seed/districts.seed';
import { seedItems } from 'db/seed/item.seed';
import { seedOrders } from 'db/seed/order.seed';
import { seedProvinces } from 'db/seed/provinces.seed';
import { seedSubdistricts } from 'db/seed/subdistricts.seed';
import { seedUnits } from 'db/seed/unit.seed';
import { seedUsers } from 'db/seed/user.seed';
import { seedVehicles } from 'db/seed/vehicle.seed';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { subdistricts } from 'db/schema/subdistricts';
import { like } from 'drizzle-orm';
import { RoleEnum } from '@/enums/RoleEnum';
import { faker } from '@faker-js/faker/locale/id_ID';

await seedProvinces()
await seedCities()
await seedDistricts()
await seedSubdistricts()

const _subdistricts = await db
  .select({
    code: subdistricts.code
  })
  .from(subdistricts)
  .where(
    like(
      subdistricts.code,
      '%33%'
    )
  )

await Promise.all(Array.from({ length: 3 }).map(async (_, index) => {
  const branchId = await seedBranches(_subdistricts.map((el) => el.code))
  if (index === 0) {
    await seedUsers(branchId, RoleEnum.SuperAdmin)
  }

  await Promise.all([
    ...Array.from({ length: faker.number.int({ min: 1, max: 2 }) }).map(() => seedUsers(branchId, RoleEnum.Admin)),
    ...Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => seedUsers(branchId, RoleEnum.Agent)),
    ...Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map(() => seedUsers(branchId, RoleEnum.Customer)),
    ...Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map(() => seedUsers(branchId, RoleEnum.Employee)),
    ...Array.from({ length: faker.number.int({ min: 1, max: 4 }) }).map(() => seedUsers(branchId, RoleEnum.Owner)),
  ])
}))

// await seedUsers()

await seedCategories()
await seedUnits()
// await seedItems()
await seedVehicles()
// await seedOrders()