import { validationMessages } from '@/constants/ValidationMessage';
import { products } from 'db/schema/products';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { ProductItemCreate, ProductItemCreateSchema } from '../productItems/ProductItemCreateSchema';

const _ProductCreateSchema = createInsertSchema(products, {
  name: z.string({ message: validationMessages.required('Nama produk') }).openapi({ example: 'Event kecil' }),
  overtimeRatio: z.number().positive({ message: validationMessages.positiveNumber('Persentase lembur') }).max(1, validationMessages.maxNumber('Persentase Lembur', 1)).nullable(),
  price: z.number({ message: validationMessages.requiredNumber('Harga') }).positive()
}).pick({
  name: true,
  overtimeRatio: true,
  price: true,
})

export type ProductCreate = z.infer<typeof _ProductCreateSchema> & {
  productItems: Array<ProductItemCreate>
}

export const ProductCreateSchema: z.ZodType<ProductCreate> = _ProductCreateSchema.extend({
  productItems: z.array(ProductItemCreateSchema)
}).openapi('ProductCreate')