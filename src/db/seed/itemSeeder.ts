import { db } from '..'
import { itemsTable } from '../schema/items'
import { faker } from '@faker-js/faker/locale/id_ID'

export async function seedItems() {
  console.log('Seeding items...')
  await db.insert(itemsTable).values(new Array(20).fill('').map(() => ({
    quantity: faker.number.int({ min: 1, max: 10 }),
    name: faker.word.noun(),
    ownerId: faker.helpers.arrayElement([1, 2, 3]),
    price: faker.number.int({
      min: 20000,
      max: 500000,
    }),
    subCategoryId: faker.helpers.arrayElement([1, 2, 3, 4, 5])
  })))
}