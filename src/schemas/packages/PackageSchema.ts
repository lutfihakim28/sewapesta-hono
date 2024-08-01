import { packagesTable } from 'db/schema/packages';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { PackageItem, PackageItemSchema } from '../packageItems/PackageItemSchema';

const _PackageSchema = createSelectSchema(packagesTable).pick({
  id: true,
  price: true,
  overtimeRatio: true,
  createdAt: true,
  updatedAt: true,
})

export type Package = z.infer<typeof _PackageSchema> & {
  packageItems?: Array<PackageItem>
}

export const PackageSchema: z.ZodType<Package> = _PackageSchema.extend({
  packageItems: z.array(PackageItemSchema)
}).openapi('Package')