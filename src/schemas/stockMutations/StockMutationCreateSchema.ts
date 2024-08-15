import { stockMutations } from 'db/schema/stockMutations';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const StockMutationCreateSchema = createInsertSchema(stockMutations).pick({
  itemId: true,
  quantity: true,
  type: true,
  note: true,
  orderId: true,
})

export type StockMutationCreate = z.infer<typeof StockMutationCreateSchema>