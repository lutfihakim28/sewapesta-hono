import dayjs from 'dayjs';
import { db } from '..';
import { employeesTable } from '../schema/employees';
import { faker } from '@faker-js/faker/locale/id_ID'

export async function seedEmployees() {
  console.log('Seeding employees...')
  const length = 28;
  const names = new Array(length).fill('').map(() => faker.person.fullName());
  await db.insert(employeesTable).values(new Array(length).fill('').map((_, index) => {
    return {
      name: names[index],
      categoryId: faker.helpers.arrayElement([1, 2]),
      phone: faker.phone.number(),
      createdAt: dayjs().unix(),
    }
  }))
}