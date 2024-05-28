import { itemsTable } from '@/db/schema/items';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ItemResponseSchema = createSelectSchema(itemsTable).openapi('ItemResponse');

export type ItemResponse = z.infer<typeof ItemResponseSchema>