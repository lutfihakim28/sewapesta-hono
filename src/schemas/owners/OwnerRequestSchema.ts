import { ownersTable } from '@/db/schema/owners';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OwnerRequestSchema = createInsertSchema(ownersTable, {
  name: z.string({ message: 'Nama pemilik wajib diisi.' }).openapi({ example: 'Budi' }),
  phone: z.string({ message: 'Nomor telepon wajib diisi.' }).openapi({ example: '628123242312' }),
}).pick({
  name: true,
  phone: true,
}).openapi('OwnerRequest')

export type OwnerRequest = z.infer<typeof OwnerRequestSchema>