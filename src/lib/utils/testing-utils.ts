import { db } from 'db';
import { RoleEnum } from '../enums/RoleEnum';
import { users } from 'db/schema/users';
import { eq } from 'drizzle-orm';
import { login } from '@/api/auth/Auth.test';
import { LoginData } from '@/api/auth/Auth.schema';

export async function getTestUsers(): Promise<Record<RoleEnum, LoginData>> {
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
    .select({ username: users.username })
    .from(users)
    .where(eq(users.role, role))
    .limit(1)

  const response = await login(user?.username)

  return response.data;
}

export function generateTestHeader(token?: string, contentType = 'application/json') {
  const header = new Headers({
    'Content-Type': contentType
  })

  if (token) {
    header.append('Authorization', `Bearer ${token}`)
  }

  return header
}