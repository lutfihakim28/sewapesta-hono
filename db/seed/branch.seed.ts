import { faker } from '@faker-js/faker/locale/id_ID';
import { db } from 'db/index';
import { branches } from 'db/schema/branches';
import { subdistricts } from 'db/schema/subdistricts';
import { like } from 'drizzle-orm';

export async function seedBranches() {
  console.log('Seeding branches...')
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
  const [branch] = await db
    .insert(branches)
    .values({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      cpName: faker.person.fullName(),
      cpPhone: faker.phone.number(),
      subdistrictCode: faker.helpers.arrayElement(_subdistricts.map((subdistrict) => subdistrict.code))
    })
    .returning({
      id: branches.id
    })

  return branch.id
}