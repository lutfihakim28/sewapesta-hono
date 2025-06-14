import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { products } from 'db/schema/products';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tData, tMessage } from '@/utils/constants/locales/locale';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { OptionSchema } from '@/utils/schemas/Option.schema';
import { ObjectSchema } from '@/utils/schemas/Object.schema';

export type ProductColumn = keyof typeof products.$inferSelect

export const ProductSchema = createSelectSchema(products)
  .pick({
    id: true,
    name: true,
  })
  .extend({
    packageCount: new NumberSchema('Total Package').whole().getSchema()
  })
  .openapi('Product')

export type ProductListColumn = keyof Pick<SchemaType<typeof ProductSchema>, 'id' |
  'name'>;

export const ProductFilterSchema = SearchSchema
  .merge(PaginationSchema)
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

export const ProductOptionResponseSchema = ApiResponseDataSchema(new ArraySchema('Category options', OptionSchema).getSchema(), tMessage({
  key: 'successList',
  lang: 'en',
  textCase: 'sentence',
  params: {
    data: tData({ key: 'productOptions', lang: 'en' })
  }
}))

export const ProductCreateManySchema = new ObjectSchema({
  names: new ArraySchema('Names', new StringSchema('Name').getSchema()).getSchema()
}).getSchema().openapi('ProductCreateMany')


export const ProductResponseSchema = ApiResponseDataSchema(ProductSchema, tMessage({
  key: 'successCreate',
  lang: 'en',
  textCase: 'sentence',
  params: {
    data: tData({ key: 'product', lang: 'en' })
  }
}))

export const ProductCreateManyResponseSchema = ApiResponseDataSchema(ProductListSchema, tMessage({
  key: 'successCreate',
  lang: 'en',
  textCase: 'sentence',
  params: {
    data: tData({ key: 'product', lang: 'en' })
  }
}))

export type Product = SchemaType<typeof ProductSchema>
export type ProductFilter = SchemaType<typeof ProductFilterSchema>
export type ProductRequest = SchemaType<typeof ProductRequestSchema>
export type ProductCreateMany = SchemaType<typeof ProductCreateManySchema>