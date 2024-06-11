import { damagedItemsTable } from '@/db/schema/damagedItems';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { ParamIdSchema } from '../ParamIdSchema';

export const DamagedItemRequestSchema = createInsertSchema(damagedItemsTable, {
  quantity: z
    .number({ message: 'Kuantitas barang rusak harus diisi.' })
    .positive({ message: 'Kuantitas harus positif.' }),
  description: z.optional(z.string()),
}).pick({ quantity: true, description: true }).openapi('DamagedItemRequest')

export const DamagedItemParamSchema = ParamIdSchema.merge(z.object({
  damagedItemId: z.string().openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: '28',
  }),
})).openapi('DamagedItemParamId')

export type DamagedItemRequest = z.infer<typeof DamagedItemRequestSchema>
export type DamagedItemParam = z.infer<typeof DamagedItemParamSchema>