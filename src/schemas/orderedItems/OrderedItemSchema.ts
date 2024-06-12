import { orderedItemsTable } from '@/db/schema/orderedItems';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const _OrderedItemSchema = createSelectSchema(orderedItemsTable, {
  createdAt: z.string().openapi({
    example: '28 Agustus 2024 15:28:30',
    description: 'Datetime format'
  }),
  updatedAt: z.string().openapi({
    example: '28 Agustus 2024 15:28:30',
    description: 'Datetime format'
  })
}).pick({
  createdAt: true,
  id: true,
  quantity: true,
  updatedAt: true,
});

export const OrderedItemSchema = _OrderedItemSchema
  .merge(z.object({
    // TODO: add order relations
  }).partial())
  .openapi('OrderedItem')

export type OrderedItem = z.infer<typeof OrderedItemSchema>