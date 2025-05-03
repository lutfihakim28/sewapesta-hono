import { profiles } from 'db/schema/profiles';
import { db } from '..';
import { faker } from '@faker-js/faker/locale/id_ID';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { users } from 'db/schema/users';

export async function seedUsers(subdistrictsCode: string[], role: RoleEnum = RoleEnum.SuperAdmin, id: number = 0) {
  const user = generateUserName()
  const name = role === RoleEnum.SuperAdmin ? 'superadmin' : user.fullName
  const username = role === RoleEnum.SuperAdmin ? 'superadmin' : `${role.toLowerCase()}_${id}`
  console.log(`Seeding ${username}...`)
  return await db.transaction(async (transaction) => {
    const [user] = await transaction
      .insert(users)
      .values({
        password: await Bun.password.hash('password'),
        username,
        role,
      })
      .returning({
        id: users.id
      })

    await transaction
      .insert(profiles)
      .values({
        name,
        userId: user.id,
        phone: faker.helpers.fromRegExp('628[1-9][0-9]{8,9}'),
        address: faker.location.streetAddress(),
        subdistrictCode: faker.helpers.arrayElement(subdistrictsCode),
      })
      .returning({
        id: profiles.id
      })


    return user.id
  })
}

function generateUserName() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`
  };
}