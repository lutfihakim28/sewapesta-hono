import { profiles } from 'db/schema/profiles';
import { db } from '..';
import { faker } from '@faker-js/faker/locale/id_ID';
import { RoleEnum } from '@/enums/RoleEnum';
import { users } from 'db/schema/users';

let id = 0

export async function seedUsers(branchId: number, subdistrictsCode: Array<string>, role: RoleEnum = RoleEnum.SuperAdmin) {
  const name = role === RoleEnum.SuperAdmin ? 'superadmin' : faker.person.fullName()
  const username = role === RoleEnum.SuperAdmin ? 'superadmin' : faker.internet.userName({
    firstName: name.split(' ')[0],
    lastName: name.split(' ')[1],
  })
  console.log(`Seeding ${username} for branch ${branchId}...`)
  return await db.transaction(async (tx) => {
    const [profile] = await tx
      .insert(profiles)
      .values({
        name,
        phone: faker.helpers.fromRegExp('+628[1-9][0-9]{8,9}'),
        address: faker.location.streetAddress(),
        subdistrictCode: faker.helpers.arrayElement(subdistrictsCode),
      })
      .returning({
        id: profiles.id
      })

    const [user] = await tx
      .insert(users)
      .values({
        password: await Bun.password.hash('password'),
        profileId: profile.id,
        username,
        role,
        branchId,
      })
      .returning({
        id: users.id
      })

    id++


    return user.id
  })
}