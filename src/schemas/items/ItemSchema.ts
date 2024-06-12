import { itemsTable } from '@/db/schema/items';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { OwnerSchema } from '../owners/OwnerSchema';
import { SubcategorySchema } from '../subcategories/SubcategorySchema';
import { UnitSchema } from '../units/UnitSchema';
import { DamagedItemSchema } from '../damagedItems/DamagedItemSchema';
import { OrderedItemSchema } from '../orderedItems/OrderedItemSchema';

const _ItemSchema = createSelectSchema(itemsTable, {
  quantity: z.object({
    available: z.number().positive().openapi({ example: 5 }),
    damaged: z.number().positive().openapi({ example: 3 }),
    used: z.number().positive().openapi({ example: 2 }),
    total: z.number().positive().openapi({ example: 10 }),
  }),
}).pick({
  id: true,
  name: true,
  price: true,
  quantity: true,
});

export const ItemSchema = _ItemSchema.merge(z.object({
  owner: OwnerSchema,
  subcategory: SubcategorySchema,
  unit: UnitSchema,
  damaged: z.array(DamagedItemSchema),
  ordered: z.array(OrderedItemSchema),
}).partial()).openapi('Item');

export type Item = z.infer<typeof ItemSchema>