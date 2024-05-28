import { itemsTable } from '@/db/schema/items';
import { ItemStatusEnum } from '@/enums/ItemStatusEnum';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ItemRequestSchema = createInsertSchema(itemsTable, {
  name: z.string({ message: 'Nama barang wajib diisi.' }).openapi({ example: 'Lampu' }),
  quantity: z.number({ message: 'Kuantitas barang wajib diisi angka.' }).openapi({ example: 10 }),
  price: z.number({ message: 'Harga barang wajib diisi angka.' }).openapi({ example: 100000 }),
  status: z.enum([
    ItemStatusEnum.InUse,
    ItemStatusEnum.Maintenance,
    ItemStatusEnum.Ready,
  ], { message: 'Status barang wajib diisi.' }).openapi({ example: ItemStatusEnum.Ready }),
  subcategoryId: z.number({ message: 'Subkategori barang harus dipilih.' }).openapi({ example: 1 }),
  ownerId: z.number({ message: 'Pemilik barang harus dipilih.' }).openapi({ example: 1 }),
}).pick({
  name: true,
  quantity: true,
  price: true,
  status: true,
  subcategoryId: true,
  ownerId: true,
}).openapi('ItemRequest');

export type ItemRequest = z.infer<typeof ItemRequestSchema>