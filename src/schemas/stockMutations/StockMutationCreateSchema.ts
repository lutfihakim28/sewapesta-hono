import { itemMutations } from 'db/schema/itemMutations';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const StockMutationCreateSchema = createInsertSchema(itemMutations).pick({
  itemId: true,
  quantity: true,
  type: true,
  note: true,
  orderId: true,
})

export type StockMutationCreate = z.infer<typeof StockMutationCreateSchema>