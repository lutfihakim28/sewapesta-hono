import dayjs from 'dayjs';
import { db } from '..';
import { usersTable } from '../schema/users';

export async function seedUsers() {
  console.log('Seeding users...')
  await db.insert(usersTable).values({
    username: 'superadmin',
    password: await Bun.password.hash('password'),
  })
}