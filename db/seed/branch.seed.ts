import { faker } from '@faker-js/faker/locale/id_ID';
import { db } from 'db/index';
import { branches } from 'db/schema/branches';

export async function seedBranches() {
  console.log('Seeding branches...')
  await db.insert(branches).values({
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    cpName: faker.person.fullName(),
    cpPhone: faker.phone.number(),
    subdistrictCode: '33.74.12.1001'
  })
}