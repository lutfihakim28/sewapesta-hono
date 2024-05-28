import { accountsTable } from '@/db/schema/accounts';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const AccountRequestSchema = createInsertSchema(accountsTable, {
  name: z.string({
    message: 'Nama akun harus diisi.'
  }).openapi({
    example: 'Budi',
  })
}).pick({ name: true }).openapi('AccountRequest')

export type AccountRequest = z.infer<typeof AccountRequestSchema>