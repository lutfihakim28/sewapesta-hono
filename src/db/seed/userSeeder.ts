import dayjs from 'dayjs';
import { db } from '..';
import { accountsTable } from '../schema/accounts';
import { usersTable } from '../schema/users';

export async function seedUsers() {
  console.log('Seeding users...')
  const account = await db.insert(accountsTable).values({
    name: 'Afiska',
    createdAt: dayjs().unix(),
  }).returning({ id: accountsTable.id });

  await db.insert(usersTable).values({
    username: 'superadmin',
    password: await Bun.password.hash('password'),
    accountId: account[0].id,
  })
}