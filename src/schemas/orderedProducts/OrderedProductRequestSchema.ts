import { validationMessages } from '@/constants/ValidationMessage';
import { orderedProducts } from 'db/schema/orderedProducts';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const _OrderedProductRequestSchema = createInsertSchema(orderedProducts, {
  productId: z.number({ message: validationMessages.requiredNumber('ID produk') }).openapi({ example: 1 }),
  baseQuantity: z.number({ message: validationMessages.requiredNumber('Kuantitas dasar') }).openapi({ example: 1 }),
  orderedQuantity: z.number({ message: validationMessages.requiredNumber('Kuantitas diorder') }).openapi({ example: 1 }),
  orderedUnitId: z.number({ message: validationMessages.requiredNumber('Satuan diorder') }).openapi({ example: 1 }),
  price: z.number({ message: validationMessages.requiredNumber('Harga') }).openapi({ example: 1 }),
}).pick({
  baseQuantity: true,
  productId: true,
  orderedQuantity: true,
  orderedUnitId: true,
  price: true,
})

export type OrderedProductRequest = z.infer<typeof _OrderedProductRequestSchema> & {
  employees: Array<number>
}

export const OrderedProductRequestSchema: z.ZodType<OrderedProductRequest> = _OrderedProductRequestSchema.extend({
  employees: z.array(z.number()).openapi({ example: [1, 2] })
}).openapi('OrderedProductRequest')