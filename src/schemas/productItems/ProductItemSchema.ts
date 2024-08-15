import { productItems } from 'db/schema/productItems';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const _ProductItemSchema = createSelectSchema(productItems).pick({
  id: true,
  price: true,
})

export type ProductItem = z.infer<typeof _ProductItemSchema>

export const ProductItemSchema: z.ZodType<ProductItem> = _ProductItemSchema.openapi('ProductItem')
