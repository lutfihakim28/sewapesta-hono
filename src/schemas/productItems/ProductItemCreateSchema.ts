import { validationMessages } from '@/constatnts/validationMessages';
import { productsItems } from 'db/schema/productsItems';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ProductItemCreateSchema = createInsertSchema(productsItems, {
  itemId: z.number({ message: validationMessages.requiredNumber('ID barang') }),
  price: z.number({ message: validationMessages.requiredNumber('Harga barang') })
}).pick({
  itemId: true,
  price: true,
})

export type ProductItemCreate = z.infer<typeof ProductItemCreateSchema>