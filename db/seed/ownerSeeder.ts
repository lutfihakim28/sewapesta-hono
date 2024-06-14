import { db } from '..';
import { accountsTable } from '../schema/accounts';
import { faker } from '@faker-js/faker/locale/id_ID'
import { ownersTable } from '../schema/owners';
import dayjs from 'dayjs';
import { OwnerTypeEnum } from '@/enums/OwnerTypeEnum';

export async function seedOwners() {
  console.log('Seeding owners...')
  const length = 3;
  const names = new Array(length).fill('').map(() => faker.person.fullName());
  const account = await db.insert(accountsTable).values(names.map((name) => ({ name, createdAt: dayjs().unix(), }))).returning({ id: accountsTable.id })
  await db.insert(ownersTable).values(new Array(length).fill('').map((_, index) => {
    return {
      name: names[index],
      phone: faker.phone.number(),
      type: faker.helpers.enumValue(OwnerTypeEnum),
      accountId: account[index].id,
      createdAt: dayjs().unix(),
    }
  }))
}