import { validationMessages } from '@/constants/validationMessage';
import { units } from 'db/schema/units';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const UnitRequestSchema = createInsertSchema(units, {
  name: z.string({
    message: validationMessages.required('Nama satuan')
  })
}).pick({
  name: true,
}).openapi('UnitRequest')

export type UnitRequest = z.infer<typeof UnitRequestSchema>