import dayjs from 'dayjs';
import { db } from '..';
import { users } from '../schema/users';

export async function seedUsers() {
  console.log('Seeding users...')
  await db.insert(users).values({
    username: 'superadmin',
    password: await Bun.password.hash('password'),
  })
}