import { profiles } from 'db/schema/profiles';
import { db } from '..';
import { users } from '../schema/users';
import { faker } from '@faker-js/faker/locale/id_ID';
import { branches } from 'db/schema/branches';

export async function seedUsers() {
  console.log('Seeding users...')
  await db.transaction(async (tx) => {
    const [profile] = await tx
      .insert(profiles)
      .values({
        name: faker.person.fullName(),
        phone: faker.phone.number(),
      })
      .returning({
        id: profiles.id
      })
  })
  // await db.insert(users).values({
  //   username: 'superadmin',
  //   password: await Bun.password.hash('password'),
  //   branchId: 1,
  //   roleId: 1,
  // })
}