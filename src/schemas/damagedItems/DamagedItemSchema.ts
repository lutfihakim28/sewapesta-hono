import { damagedItemsTable } from '@/db/schema/damagedItems';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const DamagedItemSchema = createSelectSchema(damagedItemsTable, {
  createdAt: z.string().openapi({
    example: '28 Agustus 2024 15:28:30',
    description: 'Datetime format'
  }),
  updatedAt: z.string().openapi({
    example: '28 Agustus 2024 15:28:30',
    description: 'Datetime format'
  })
})
  .pick({
    createdAt: true,
    description: true,
    id: true,
    quantity: true,
    updatedAt: true,
  })
  .openapi('DamagedItem')

export type DamagedItem = z.infer<typeof DamagedItemSchema>