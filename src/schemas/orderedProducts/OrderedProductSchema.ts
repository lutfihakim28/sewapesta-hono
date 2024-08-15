import { orderedProducts } from 'db/schema/orderedProducts';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { UnitSchema } from '../units/UnitSchema';
import { ProductSchema } from '../products/ProductSchema';
import { ProductEmployeeAssignmentSchema } from '../productEmployeeAssignments/ProductEmployeeAssignmentSchema';

const _OrderedProductSchema = createSelectSchema(orderedProducts, {
}).pick({
  id: true,
  baseQuantity: true,
  orderedQuantity: true,
  price: true,
});

export const OrderedProductSchema = _OrderedProductSchema
  .merge(z.object({
    orderedUnit: UnitSchema,
    product: ProductSchema,
    assignedEmployees: z.array(ProductEmployeeAssignmentSchema)
  }))
  .openapi('OrderedProduct')

export type OrderedProduct = z.infer<typeof OrderedProductSchema>