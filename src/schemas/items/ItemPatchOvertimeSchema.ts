import { itemsTable } from 'db/schema/items';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ItemPatchOvertimeSchema = createInsertSchema(itemsTable)

export type ItemPatchOvertime = z.infer<typeof ItemPatchOvertimeSchema>;