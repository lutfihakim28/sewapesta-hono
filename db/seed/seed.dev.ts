import { db } from 'db';
import { seedBranches } from 'db/seed/branches.seed';
import { seedCategories } from 'db/seed/categories.seed';
import { seedCities } from 'db/seed/cities.seed';
import { seedDistricts } from 'db/seed/districts.seed';
import { seedItems } from 'db/seed/items.seed';
import { seedProducts } from 'db/seed/products.seed';
import { seedProvinces } from 'db/seed/provinces.seed';
import { seedSubdistricts } from 'db/seed/subdistricts.seed';
import { seedUnits } from 'db/seed/units.seed';
import { seedUsers } from 'db/seed/users.seed';
import { subdistricts } from 'db/schema/subdistricts';
import { like } from 'drizzle-orm';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { faker } from '@faker-js/faker/locale/id_ID';
import { seedProductItem } from './products-items.seed';
import { seedItemOwner } from './items-owners.seed';

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

const unitsId = await seedUnits()
const categoriesId = await seedCategories()
const items = await seedItems({ unitsId: unitsId, categoriesId: categoriesId })


await Promise.all(Array.from({ length: 3 }).map(async (_, index) => {
  const branchId = await seedBranches(_subdistricts.map((el) => el.code))
  if (index === 0) {
    await seedUsers(branchId, _subdistricts.map((el) => el.code), RoleEnum.SuperAdmin)
  }

  const productsId = await seedProducts(branchId);
  await seedProductItem({ items, productsId })

  await Promise.all([
    ...Array.from({ length: faker.number.int({ min: 1, max: 2 }) }).map((_, index) => seedUsers(branchId, _subdistricts.map((el) => el.code), RoleEnum.Admin, index)),
    ...Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map((_, index) => seedUsers(branchId, _subdistricts.map((el) => el.code), RoleEnum.Agent, index)),
    ...Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map((_, index) => seedUsers(branchId, _subdistricts.map((el) => el.code), RoleEnum.Customer, index)),
    ...Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map((_, index) => seedUsers(branchId, _subdistricts.map((el) => el.code), RoleEnum.Employee, index)),
  ])

  const ownersId = await Promise.all(Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map((_, index) => seedUsers(branchId, _subdistricts.map((el) => el.code), RoleEnum.Owner, index)))

  await seedItemOwner({ ownersId, itemsId: items.map((item) => item.id) })
}))