import dayjs from 'dayjs'
import { db } from '..'
import { items } from '../schema/items'
import { faker } from '@faker-js/faker/locale/id_ID'

export async function seedItems() {
  console.log('Seeding items...')
  await db.insert(items).values([
    {
      quantity: faker.number.int({ min: 800, max: 1000 }),
      name: 'Sound System Event',
      ownerId: faker.helpers.arrayElement([1, 2, 3]),
      unitId: 1,
      categoryId: 5,
      createdAt: dayjs().unix(),
    },
    {
      quantity: faker.number.int({ min: 800, max: 1000 }),
      name: 'Sound System Hajatan',
      ownerId: faker.helpers.arrayElement([1, 2, 3]),
      unitId: 1,
      categoryId: 5,
      createdAt: dayjs().unix(),
    },
    {
      quantity: faker.number.int({ min: 800, max: 1000 }),
      name: 'Generator 10000Watt',
      ownerId: faker.helpers.arrayElement([1, 2, 3]),
      unitId: 1,
      categoryId: 6,
      createdAt: dayjs().unix(),
    },
    {
      quantity: faker.number.int({ min: 800, max: 1000 }),
      name: 'Generator 15000Watt',
      ownerId: faker.helpers.arrayElement([1, 2, 3]),
      unitId: 1,
      categoryId: 6,
      createdAt: dayjs().unix(),
    },
    {
      quantity: faker.number.int({ min: 800, max: 1000 }),
      name: 'Generator 20000Watt',
      ownerId: faker.helpers.arrayElement([1, 2, 3]),
      unitId: 1,
      categoryId: 6,
      createdAt: dayjs().unix(),
    },
  ])
}