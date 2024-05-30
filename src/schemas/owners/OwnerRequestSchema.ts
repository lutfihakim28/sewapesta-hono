import { validationMessages } from '@/constatnts/validationMessages';
import { ownersTable } from '@/db/schema/owners';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OwnerRequestSchema = createInsertSchema(ownersTable, {
  name: z.string({ message: validationMessages.required('Nama') }).openapi({ example: 'Budi' }),
  phone: z.string({ message: validationMessages.required('Nomor HP') }).openapi({ example: '628123242312' }),
}).pick({
  name: true,
  phone: true,
}).openapi('OwnerRequest')

export type OwnerRequest = z.infer<typeof OwnerRequestSchema>