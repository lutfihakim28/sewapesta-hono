import { items } from 'db/schema/items';
import { productsItems } from 'db/schema/productsItems';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ProductSchema } from '../products/Product.schema';
import { z } from 'zod';
import { OvertimeTypeEnum } from '@/lib/enums/OvertimeTypeEnum';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { messages } from '@/lib/constants/messages';
import { CategorySchema } from '../categories/Category.schema';

export type ItemColumn = keyof typeof items.$inferSelect
export type ProductItemColumn = keyof typeof productsItems.$inferSelect

export const ItemSchema = createSelectSchema(items).pick({
  categoryId: true,
  id: true,
  name: true,
  ownerId: true,
  price: true,
  quantity: true,
  unitId: true,
}).openapi('Item')

export const ProductItemSchema = createSelectSchema(productsItems).pick({
  overtimeMultiplier: true,
  overtimePrice: true,
  overtimeRatio: true,
  overtimeType: true,
})

export const ItemExtendedSchema = ItemSchema.omit({
  categoryId: true,
  ownerId: true,
  unitId: true
}).extend({
  product: ProductItemSchema.merge(ProductSchema.pick({
    id: true,
    name: true,
    rentalTimeIncrement: true,
  })).openapi('ProductItem'),
  owner: UserExtendedSchema.pick({
    id: true,
    profile: true
  }),
  category: CategorySchema
})
  .openapi('ItemExtended')

export const ItemFilterSchema = z.object({
  categoryId: z.number().optional(),
  ownerId: z.number().optional(),
  productId: z.number().optional(),
  overtimeType: z.nativeEnum(OvertimeTypeEnum).optional(),
})
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema<ItemColumn | ProductItemColumn>([
    'price',
    'quantity',
    'overtimeMultiplier',
    'overtimePrice',
    'overtimeRatio',
    'overtimeType'
  ]))
  .openapi('ItemFilter')

export const ItemListSchema = ApiResponseListSchema(ItemExtendedSchema, messages.successList('Item'))
// export const 