import { validationMessages } from '@/constants/validationMessage';
import { items } from 'db/schema/items';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { ImageRequestSchema } from '../images/ImageRequestSchema';

export const ItemCreateSchema = createInsertSchema(items, {
  name: z.string({ message: validationMessages.required('Nama barang') }).openapi({ example: 'Lampu' }),
  quantity: z
    .string({ message: validationMessages.required('Kuantitas barang') })
    .openapi({ example: '10' }),
  categoryId: z.string({ message: validationMessages.required('Subkategori') }).openapi({ example: '1' }),
  ownerId: z.string({ message: validationMessages.required('Pemilik barang') }).openapi({ example: '1' }),
  unitId: z.string({ message: validationMessages.required('Satuan barang') }).openapi({ example: '1' }),
}).pick({
  name: true,
  quantity: true,
  categoryId: true,
  ownerId: true,
  unitId: true,
}).merge(ImageRequestSchema).merge(z.object({
  price: z.number().optional(),
  overtimeRatio: z.number().optional(),
})).openapi('ItemCreate');

export const ItemUpdateSchema = ItemCreateSchema.merge(z.object({
  deletedImages: z.string().optional().openapi({
    example: '1,2,3,4',
    description: 'Array like string without brackets.'
  }),
})).openapi('ItemUpdate')

export type ItemCreate = z.infer<typeof ItemCreateSchema>
export type ItemUpdate = z.infer<typeof ItemUpdateSchema> & {
  deletedImages: string
}