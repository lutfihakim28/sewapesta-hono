import { LoginData } from '@/api/auth/Auth.schema';
import { AuthService } from '@/api/auth/Auth.service';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { db } from 'db';
import { users } from 'db/schema/users';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, test } from 'bun:test'
import { logger } from '@/lib/utils/logger';

export type TestAuthData = Record<RoleEnum, LoginData>

export let authData: TestAuthData;

async function getTestUsers(): Promise<TestAuthData> {
  const roles = [RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Customer, RoleEnum.Employee, RoleEnum.Owner, RoleEnum.SuperAdmin]
  const [admin, agent, customer, employee, owner, superadmin] = await Promise.all(roles.map((role) => getUserLogin(role)));

  return {
    Admin: admin,
    Agent: agent,
    Customer: customer,
    Employee: employee,
    Owner: owner,
    SuperAdmin: superadmin,
  }
}

async function getUserLogin(role: RoleEnum) {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, role))
    .limit(1)

  const response = await AuthService.login(user.id)

  return response;
}

beforeAll(async () => {
  console.log('Preparing account...')
  authData = await getTestUsers()

  logger.debug(authData, 'Test Data')

  globalThis.testAuthData = authData
  console.log('Ready to test')
})

afterAll(() => {
  globalThis.testAuthData = {} as TestAuthData
})