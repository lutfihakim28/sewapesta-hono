import { damagedItemsTable } from '@/db/schema/damagedItems';
import { createSelectSchema } from 'drizzle-zod';

export const DamagedItemSchema = createSelectSchema(damagedItemsTable).openapi('DamagedItem')