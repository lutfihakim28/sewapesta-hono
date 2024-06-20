import { validationMessages } from '@/constatnts/validationMessages';
import { accountsTable } from 'db/schema/accounts';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const AccountPaymentRequestSchema = createInsertSchema(accountsTable, {
  name: z.string({
    message: validationMessages.required('Nama'),
  }).openapi({
    example: 'Budi',
  }),
  number: z.string({
    message: validationMessages.required('Nomor Rekening'),
  }).openapi({
    example: '1892382022',
  }),
  bank: z.string({
    message: validationMessages.required('Nama Bank'),
  }).openapi({
    example: 'BCA',
  })
}).pick({
  name: true,
  number: true,
  bank: true,
})

export const AccountCreateSchema = createInsertSchema(accountsTable, {
  name: z.string({
    message: validationMessages.required('Nama'),
  }).openapi({
    example: 'Budi',
  })
}).pick({ name: true }).openapi('AccountRequest')

export const AccountUpdateSchema = createInsertSchema(accountsTable, {
  balance: z.number({
    message: 'Saldo akun harus diisi.'
  })
}).pick({ balance: true }).openapi('AccountUpdate')

export type AccountPaymentRequest = z.infer<typeof AccountPaymentRequestSchema>
export type AccountCreate = z.infer<typeof AccountCreateSchema>
export type AccountUpdate = z.infer<typeof AccountUpdateSchema>