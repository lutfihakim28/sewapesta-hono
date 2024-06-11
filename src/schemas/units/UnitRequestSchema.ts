import { validationMessages } from '@/constatnts/validationMessages';
import { unitsTable } from '@/db/schema/units';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const UnitRequestSchema = createInsertSchema(unitsTable, {
  name: z.string({
    message: validationMessages.required('Nama satuan')
  })
}).pick({
  name: true,
}).openapi('UnitRequest')