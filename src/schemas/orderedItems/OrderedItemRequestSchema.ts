import { orderedItemsTable } from 'db/schema/orderedItems';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OrderedItemRequestSchema = createInsertSchema(orderedItemsTable, {
  // quantity: z
  //   .number({ message: 'Kuantitas barang rusak harus diisi.' })
  //   .positive({ message: 'Kuantitas harus positif.' }),
}).pick({
  baseQuantity: true,
  itemId: true,
  orderedQuantity: true,

}).openapi('OrderedItemRequest')

export type OrderedItemRequest = z.infer<typeof OrderedItemRequestSchema>