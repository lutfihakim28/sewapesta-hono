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

export const AccountUpdateSchema = createInsertSchema(accountsTable, {
  balance: z.number({
    message: 'Saldo akun harus diisi.'
  })
}).pick({ balance: true })

export const AccountWithdrawSchema = z.object({
  amount: z.number({
    message: 'Nominal harus diisi angka.',
  }).openapi({
    example: 400000,
  }).openapi('AccountWithdraw')
})

export type AccountRequest = z.infer<typeof AccountRequestSchema>
export type AccountUpdate = z.infer<typeof AccountUpdateSchema>
export type AccountWithdraw = z.infer<typeof AccountWithdrawSchema>