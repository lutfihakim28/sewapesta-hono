import { itemsTable } from 'db/schema/items';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Owner, OwnerSchema } from '../owners/OwnerSchema';
import { Subcategory, SubcategorySchema } from '../subcategories/SubcategorySchema';
import { Unit, UnitSchema } from '../units/UnitSchema';
import { DamagedItem, DamagedItemSchema } from '../damagedItems/DamagedItemSchema';
import { OrderedItem, OrderedItemSchema } from '../orderedItems/OrderedItemSchema';
import { Image, ImageSchema } from '../images/ImageSchema';

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
  hasOvertime: true,
});

export type Item = z.infer<typeof _ItemSchema> & {
  owner: Owner | null,
  subcategory: Subcategory | null,
  unit: Unit | null,
  damaged: Array<DamagedItem> | null,
  ordered: Array<OrderedItem> | null,
  images: Array<Image> | null,
}

export const ItemSchema: z.ZodType<Item> = _ItemSchema.extend({
  owner: OwnerSchema.nullable(),
  subcategory: SubcategorySchema.nullable(),
  unit: UnitSchema.nullable(),
  damaged: z.array(DamagedItemSchema),
  ordered: z.array(OrderedItemSchema),
  images: z.array(ImageSchema)
}).openapi('Item');
