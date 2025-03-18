import { profiles } from 'db/schema/profiles';
import { db } from '..';
import { faker } from '@faker-js/faker/locale/id_ID';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { users } from 'db/schema/users';

let id = 0
let random = 0;

export async function seedUsers(branchId: number, subdistrictsCode: string[], role: RoleEnum = RoleEnum.SuperAdmin) {
  const randomId = generateNumber(random)
  const user = generateUserName()
  const name = role === RoleEnum.SuperAdmin ? 'superadmin' : user.fullName
  const username = role === RoleEnum.SuperAdmin ? 'superadmin' : faker.internet.userName({
    firstName: user.firstName,
    lastName: user.lastName + '_' + randomId,
  })
  console.log(`Seeding ${username} for branch ${branchId}...`)
  return await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({
        password: await Bun.password.hash('password'),
        username,
        role,
        branchId,
      })
      .returning({
        id: users.id
      })

    await tx
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

    id++


    return user.id
  })
}


function generateNumber(random: number) {
  const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
  if (randomNumber === random) {
    return generateNumber(randomNumber)
  }
  return randomNumber
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