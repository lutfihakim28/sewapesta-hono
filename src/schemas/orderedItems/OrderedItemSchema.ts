import { orderedItemsTable } from '@/db/schema/orderedItems';
import { createSelectSchema } from 'drizzle-zod';

export const OrderedItemSchema = createSelectSchema(orderedItemsTable).openapi('OrderedItem')