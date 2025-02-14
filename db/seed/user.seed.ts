import { profiles } from 'db/schema/profiles';
import { db } from '..';
import { faker } from '@faker-js/faker/locale/id_ID';
import { RoleEnum } from '@/enums/RoleEnum';
import { users } from 'db/schema/users';

export async function seedUsers(branchId: number, role: RoleEnum = RoleEnum.SuperAdmin) {
  console.log(`Seeding ${role} users for branch ${branchId}...`)
  await db.transaction(async (tx) => {
    const [profile] = await tx
      .insert(profiles)
      .values({
        name: faker.person.fullName(),
        phone: faker.helpers.fromRegExp('+628[1-9][0-9]{8,10}'),
      })
      .returning({
        id: profiles.id
      })

    await tx.insert(users).values({
      username: role === RoleEnum.SuperAdmin ? 'superadmin' : faker.internet.userName(),
      password: await Bun.password.hash('password'),
      profileId: profile.id,
      role,
      branchId,
    })
  })
}