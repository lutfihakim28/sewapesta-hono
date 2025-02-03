import { itemMutations } from 'db/schema/itemMutations';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const StockMutationSchema = createSelectSchema(itemMutations)

export type StockMutation = z.infer<typeof StockMutationSchema>