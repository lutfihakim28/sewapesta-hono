import { validationMessages } from '@/constatnts/validationMessages';
import { itemsTable } from '@/db/schema/items';
import { ItemStatusEnum } from '@/enums/ItemStatusEnum';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ItemRequestSchema = createInsertSchema(itemsTable, {
  name: z.string({ message: validationMessages.required('Nama barang') }).openapi({ example: 'Lampu' }),
  quantity: z
    .number({ message: validationMessages.requiredNumber('Kuantitas barang') })
    .positive({ message: validationMessages.positiveNumber('Kuantitas barang') })
    .openapi({ example: 10 }),
  price: z
    .number({ message: validationMessages.requiredNumber('Harga sewa') })
    .positive({ message: validationMessages.positiveNumber('Harga sewa') })
    .openapi({ example: 100000 }),
  status: z.enum(
    [
      ItemStatusEnum.InUse,
      ItemStatusEnum.Maintenance,
      ItemStatusEnum.Ready,
    ],
    { message: validationMessages.required('Status barang') }
  ).openapi({
    examples: [
      ItemStatusEnum.InUse,
      ItemStatusEnum.Maintenance,
      ItemStatusEnum.Ready,
    ]
  }),
  subcategoryId: z.number({ message: validationMessages.required('Subkategori') }).openapi({ example: 1 }),
  ownerId: z.number({ message: validationMessages.required('Pemilik barang') }).openapi({ example: 1 }),
}).pick({
  name: true,
  quantity: true,
  price: true,
  status: true,
  subcategoryId: true,
  ownerId: true,
}).openapi('ItemRequest');

export type ItemRequest = z.infer<typeof ItemRequestSchema>