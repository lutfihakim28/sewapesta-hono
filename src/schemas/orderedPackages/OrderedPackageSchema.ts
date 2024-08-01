import { orderedPackagesTable } from 'db/schema/orderedPackages';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { UnitSchema } from '../units/UnitSchema';

const _OrderedPackageSchema = createSelectSchema(orderedPackagesTable, {
  createdAt: z.string().openapi({
    example: '28 Agustus 2024 15:28:30',
    description: 'Datetime format'
  }),
  updatedAt: z.string().openapi({
    example: '28 Agustus 2024 15:28:30',
    description: 'Datetime format'
  })
}).pick({
  createdAt: true,
  id: true,
  baseQuantity: true,
  orderedQuantity: true,
  updatedAt: true,
});

export const OrderedPackageSchema = _OrderedPackageSchema
  .merge(z.object({
    orderedUnit: UnitSchema,
  }).partial())
  .openapi('OrderedItem')

export type OrderedPackage = z.infer<typeof OrderedPackageSchema>