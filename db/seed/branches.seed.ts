import { faker } from '@faker-js/faker/locale/id_ID';
import { db } from 'db/index';
import { branches } from 'db/schema/branches';

export async function seedBranches(subdistrictsCode: string[]) {
  faker
  console.log('Seeding branches...')
  const [branch] = await db
    .insert(branches)
    .values({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      cpName: faker.person.fullName(),
      cpPhone: faker.helpers.fromRegExp('+628[1-9][0-9]{8,9}'),
      subdistrictCode: faker.helpers.arrayElement(subdistrictsCode)
    })
    .returning({
      id: branches.id
    })

  return branch.id
}