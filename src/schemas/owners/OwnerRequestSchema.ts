import { validationMessages } from '@/constatnts/validationMessages';
import { owners } from 'db/schema/owners';
import { OwnerTypeEnum } from '@/enums/OwnerTypeEnum';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OwnerRequestSchema = createInsertSchema(owners, {
  name: z.string({ message: validationMessages.required('Nama') }).openapi({ example: 'Budi' }),
  phone: z.string({ message: validationMessages.required('Nomor HP') }).openapi({ example: '628123242312' }),
  type: z.nativeEnum(OwnerTypeEnum, { message: validationMessages.enum('Tipe', OwnerTypeEnum) }).openapi({ example: OwnerTypeEnum.Individu })
}).pick({
  name: true,
  phone: true,
  type: true,
}).openapi('OwnerRequest')

export type OwnerRequest = z.infer<typeof OwnerRequestSchema>