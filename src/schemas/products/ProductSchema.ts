import { products } from 'db/schema/products';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { ProductItem, ProductItemSchema } from '../productItems/ProductItemSchema';

const _ProductSchema = createSelectSchema(products).pick({
  id: true,
  price: true,
  overtimeRatio: true,
  createdAt: true,
})

export type Product = z.infer<typeof _ProductSchema> & {
  productItems?: Array<ProductItem>
}

export const ProductSchema: z.ZodType<Product> = _ProductSchema.extend({
  productItems: z.array(ProductItemSchema)
}).openapi('Product')