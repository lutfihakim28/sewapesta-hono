import { orderedPackagesTable } from 'db/schema/orderedPackages';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OrderedPackageRequestSchema = createInsertSchema(orderedPackagesTable, {
  // quantity: z
  //   .number({ message: 'Kuantitas barang rusak harus diisi.' })
  //   .positive({ message: 'Kuantitas harus positif.' }),
}).pick({
  baseQuantity: true,
  packageId: true,
  orderedQuantity: true,

}).openapi('OrderedItemRequest')

export type OrderedPackageRequest = z.infer<typeof OrderedPackageRequestSchema>