import dayjs from 'dayjs'
import { db } from '..'
import { itemsTable } from '../schema/items'
import { faker } from '@faker-js/faker/locale/id_ID'

export async function seedItems() {
  console.log('Seeding items...')
  await db.insert(itemsTable).values([
    {
      quantity: faker.number.int({ min: 1, max: 10 }),
      name: 'Sound System Event',
      code: 'SSE',
      ownerId: faker.helpers.arrayElement([1, 2, 3]),
      unitId: 1,
      categoryId: 5,
      createdAt: dayjs().unix(),
    },
    {
      quantity: faker.number.int({ min: 1, max: 10 }),
      name: 'Sound System Hajatan',
      code: 'SSH',
      ownerId: faker.helpers.arrayElement([1, 2, 3]),
      unitId: 1,
      categoryId: 5,
      createdAt: dayjs().unix(),
    },
    {
      quantity: faker.number.int({ min: 1, max: 10 }),
      name: 'Generator 10000Watt',
      code: 'GE10K',
      ownerId: faker.helpers.arrayElement([1, 2, 3]),
      unitId: 1,
      categoryId: 6,
      createdAt: dayjs().unix(),
    },
    {
      quantity: faker.number.int({ min: 1, max: 10 }),
      name: 'Generator 15000Watt',
      code: 'GE15K',
      ownerId: faker.helpers.arrayElement([1, 2, 3]),
      unitId: 1,
      categoryId: 6,
      createdAt: dayjs().unix(),
    },
    {
      quantity: faker.number.int({ min: 1, max: 10 }),
      name: 'Generator 20000Watt',
      code: 'GE20K',
      ownerId: faker.helpers.arrayElement([1, 2, 3]),
      unitId: 1,
      categoryId: 6,
      createdAt: dayjs().unix(),
    },
  ])
}