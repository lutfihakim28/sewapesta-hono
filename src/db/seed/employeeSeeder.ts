import { db } from '..';
import { accountsTable } from '../schema/accounts';
import { employeesTable } from '../schema/employees';
import { faker } from '@faker-js/faker/locale/id_ID'

export async function seedEmployees() {
  console.log('Seeding employees...')
  const length = 10;
  const names = new Array(length).fill('').map(() => faker.person.fullName());
  const account = await db.insert(accountsTable).values(names.map((name) => ({ name }))).returning({ id: accountsTable.id })
  await db.insert(employeesTable).values(new Array(length).fill('').map((_, index) => {
    return {
      name: names[index],
      categoryId: faker.helpers.arrayElement([1, 2]),
      phone: faker.phone.number(),
      accountId: account[index].id,
    }
  }))
}