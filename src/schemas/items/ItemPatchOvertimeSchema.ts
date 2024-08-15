import { items } from 'db/schema/items';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ItemPatchOvertimeSchema = createInsertSchema(items)

export type ItemPatchOvertime = z.infer<typeof ItemPatchOvertimeSchema>;