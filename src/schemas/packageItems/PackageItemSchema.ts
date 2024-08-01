import { packageItemsTable } from 'db/schema/packageItems';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Item, ItemSchema } from '../items/ItemSchema';
import { Package, PackageSchema } from '../packages/PackageSchema';

const _PackageItemSchema = createSelectSchema(packageItemsTable).pick({
  id: true,
  itemId: true,
  packageId: true,
})

export type PackageItem = z.infer<typeof _PackageItemSchema> & {
  item?: Item,
  package?: Package,
}

export const PackageItemSchema: z.ZodType<PackageItem> = _PackageItemSchema.extend({
  item: ItemSchema,
  package: PackageSchema,
}).openapi('PackageItem')
