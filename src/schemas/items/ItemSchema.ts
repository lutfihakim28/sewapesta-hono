import { itemsTable } from 'db/schema/items';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Owner, OwnerSchema } from '../owners/OwnerSchema';
import { Unit, UnitSchema } from '../units/UnitSchema';
import { Image, ImageSchema } from '../images/ImageSchema';
import { Category, CategorySchema } from '../categories/CategorySchema';

const _ItemSchema = createSelectSchema(itemsTable).pick({
  id: true,
  name: true,
  quantity: true,
  code: true,
});

export type Item = z.infer<typeof _ItemSchema> & {
  owner: Owner | null,
  category: Category | null,
  unit: Unit | null,
  images: Array<Image> | null,
}

export const ItemSchema: z.ZodType<Item> = _ItemSchema.extend({
  owner: OwnerSchema.nullable(),
  category: CategorySchema.nullable(),
  unit: UnitSchema.nullable(),
  images: z.array(ImageSchema)
}).openapi('Item');
