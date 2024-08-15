import { stockMutations } from 'db/schema/stockMutations';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const StockMutationSchema = createSelectSchema(stockMutations)

export type StockMutation = z.infer<typeof StockMutationSchema>