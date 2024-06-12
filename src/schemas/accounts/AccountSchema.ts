import { accountsTable } from '@/db/schema/accounts';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { EmployeeSchema } from '../employees/EmployeeSchema';

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

export const AccountSchema = _AccountSchema.merge(z.object({
  employee: EmployeeSchema,
}).partial()).openapi('Account')

export type Account = z.infer<typeof AccountSchema>