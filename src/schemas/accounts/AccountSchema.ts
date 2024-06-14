import { accountsTable } from 'db/schema/accounts';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Employee, EmployeeSchema } from '../employees/EmployeeSchema';
import { Owner, OwnerSchema } from '../owners/OwnerSchema';
import { UserSchema } from '../UserSchema';

const _AccountSchema = createSelectSchema(accountsTable, {
  updatedAt: z.string().openapi({
    example: '28 Agustus 2024 15:28:30',
    description: 'Datetime format'
  })
}).pick({
  balance: true,
  id: true,
  name: true,
  updatedAt: true,
})

export type Account = z.infer<typeof _AccountSchema> & {
  employee: Employee | null,
  user: z.infer<typeof UserSchema> | null,
  owner: Owner | null,
}

export const AccountSchema: z.ZodType<Account> = _AccountSchema.extend({
  employee: EmployeeSchema.nullable(),
  user: UserSchema.nullable(),
  owner: OwnerSchema.nullable(),
}).openapi('Account')
