import { itemsTable } from '@/db/schema/items';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ItemSchema = createSelectSchema(itemsTable).openapi('Item');


export type Item = z.infer<typeof ItemSchema>