import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { categories } from 'db/schema/categories';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { OptionSchema } from '@/utils/schemas/Option.schema';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tData, tMessage } from '@/utils/constants/locales/locale';

export const CategorySchema = createSelectSchema(categories)
  .pick({
    id: true,
    name: true,
  })
  .extend({
    itemCount: new NumberSchema('Item count').getSchema()
  })
  .openapi('Category')

export const CategoryRequestSchema = createInsertSchema(categories, {
  name: new StringSchema('Name').getSchema(),
})
  .pick({
    name: true,
  })
  .openapi('CategoryRequest')

export const CategoryFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('CategoryFilter')

const CategoryListSchema = new ArraySchema('Categories', CategorySchema)
  .getSchema()
  .openapi('CategoryList')

export const CategoryResponseListSchema = ApiResponseListSchema(CategoryListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({ lang: 'en', key: 'category', mode: 'plural' })
  }
}))
export const CategoryResponseSchema = ApiResponseDataSchema(CategorySchema, tMessage({
  key: 'successCreate',
  lang: 'en',
  textCase: 'sentence',
  params: {
    data: tData({ key: 'category', lang: 'en' })
  }
}))
export const CategoryOptionResponseSchema = ApiResponseDataSchema(new ArraySchema('Category options', OptionSchema).getSchema(), tMessage({
  key: 'successList',
  lang: 'en',
  textCase: 'sentence',
  params: {
    data: tData({ key: 'categoryOptions', lang: 'en' })
  }
}))

export type Category = SchemaType<typeof CategorySchema>
export type CategoryFilter = SchemaType<typeof CategoryFilterSchema>
export type CategoryRequest = SchemaType<typeof CategoryRequestSchema>