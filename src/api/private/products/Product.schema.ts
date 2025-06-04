import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { products } from 'db/schema/products';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tData, tMessage } from '@/utils/constants/locales/locale';

export type ProductColumn = keyof typeof products.$inferSelect

export const ProductSchema = createSelectSchema(products)
  .pick({
    id: true,
    name: true,
  })
  .openapi('Product')

export type ProductListColumn = keyof Pick<SchemaType<typeof ProductSchema>, 'id' |
  'name'>;
export const sortableProductColumn: ProductListColumn[] = [
  'id',
  'name'
]

export const ProductFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .merge(SortSchema(sortableProductColumn))
  .openapi('ProductFilter')

const ProductListSchema = new ArraySchema('Product list', ProductSchema).getSchema()

export const ProductResponseListSchema = ApiResponseListSchema(ProductListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'product',
      mode: 'plural'
    })
  }
}))

export const ProductRequestSchema = createInsertSchema(products, {
  name: new StringSchema('Name').getSchema(),
}).pick({
  name: true,
}).openapi('ProductRequest')

export const ProductResponseDataSchema = ApiResponseDataSchema(ProductSchema, tMessage({
  lang: 'en',
  key: 'successDetail',
  textCase: 'sentence',
  params: {
    data: tData({ lang: 'en', key: 'product' })
  }
}))

export type Product = SchemaType<typeof ProductSchema>
export type ProductFilter = SchemaType<typeof ProductFilterSchema>
export type ProductRequest = SchemaType<typeof ProductRequestSchema>