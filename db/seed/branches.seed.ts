import { faker } from '@faker-js/faker/locale/id_ID';
import { db } from 'db/index';
import { branches } from 'db/schema/branches';

export async function seedBranches(subdistrictsCode: Array<string>) {
  console.log('Seeding branches...')
  const [branch] = await db
    .insert(branches)
    .values({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      cpName: faker.person.fullName(),
      cpPhone: faker.phone.number(),
      subdistrictCode: faker.helpers.arrayElement(subdistrictsCode)
    })
    .returning({
      id: branches.id,
    })

  return branch.id
}