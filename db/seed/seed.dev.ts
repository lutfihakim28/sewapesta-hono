import { db } from 'db';
import { seedCities } from 'db/seed/cities.seed';
import { seedDistricts } from 'db/seed/districts.seed';
import { seedProvinces } from 'db/seed/provinces.seed';
import { seedSubdistricts } from 'db/seed/subdistricts.seed';
import { subdistricts } from 'db/schema/subdistricts';
import { like } from 'drizzle-orm';
import { users } from 'db/schema/users';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { profiles } from 'db/schema/profiles';

await seedProvinces()
await seedCities()
await seedDistricts()
await seedSubdistricts()

const [_subdistricts] = await db
  .select({
    code: subdistricts.code
  })
  .from(subdistricts)
  .where(
    like(
      subdistricts.code,
      '33%'
    )
  )
  .limit(1)

const password = await Bun.password.hash('password');

const [superadmin] = await db.insert(users).values({
  password: password,
  role: RoleEnum.SuperAdmin,
  username: 'superadmin',
}).returning()

await db.insert(profiles).values({
  name: 'Super Admin',
  phone: '6281293828348',
  subdistrictCode: _subdistricts.code,
  userId: superadmin.id,
  address: 'RT 02 RW 01',
})

// const unitsId = await seedUnits()
// const categoriesId = await seedCategories()
// const items = await seedItems({ unitsId: unitsId, categoriesId: categoriesId })


// await Promise.all(Array.from({ length: 3 }).map(async (_, index) => {
//   if (index === 0) {
//     await seedUsers(_subdistricts.map((el) => el.code), RoleEnum.SuperAdmin)
//   }

//   const productsId = await seedProducts();
//   await seedProductItem({ items, productsId })

//   await Promise.all([
//     ...Array.from({ length: faker.number.int({ min: 1, max: 2 }) }).map((_, index) => seedUsers(_subdistricts.map((el) => el.code), RoleEnum.Admin, index)),
//     ...Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map((_, index) => seedUsers(_subdistricts.map((el) => el.code), RoleEnum.Agent, index)),
//     ...Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map((_, index) => seedUsers(_subdistricts.map((el) => el.code), RoleEnum.Customer, index)),
//     ...Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map((_, index) => seedUsers(_subdistricts.map((el) => el.code), RoleEnum.Employee, index)),
//   ])

//   const ownersId = await Promise.all(Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map((_, index) => seedUsers(_subdistricts.map((el) => el.code), RoleEnum.Owner, index)))

//   await seedItemOwner({ ownersId, itemsId: items.map((item) => item.id) })
// }))