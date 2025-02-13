import { profiles } from 'db/schema/profiles';
import { db } from '..';
import { faker } from '@faker-js/faker/locale/id_ID';
import { RoleEnum } from '@/enums/RoleEnum';
import { users } from 'db/schema/users';
import { roles } from 'db/schema/roles';
import { eq } from 'drizzle-orm';

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
    const [_role] = await tx
      .select({ id: roles.id })
      .from(roles)
      .where(
        eq(roles.name, role)
      )

    await tx.insert(users).values({
      username: role === RoleEnum.SuperAdmin ? 'superadmin' : faker.internet.userName(),
      password: await Bun.password.hash('password'),
      roleId: _role.id,
      profileId: profile.id,
      branchId,
    })
  })
}