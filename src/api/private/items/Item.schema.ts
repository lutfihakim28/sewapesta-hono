import { items } from 'db/schema/items';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { UnitSchema } from '../units/Unit.schema';
import { CategorySchema } from '../categories/Category.schema';
import { ItemTypeEnum } from '@/utils/enums/ItemTypeEnum';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { EnumSchema } from '@/utils/schemas/Enum.schema';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';

export type ItemColumn = keyof typeof items.$inferSelect;

export const ItemSchema = createSelectSchema(items).pick({
  id: true,
  name: true,
  type: true,
}).extend({
  unit: UnitSchema,
  category: CategorySchema.omit({ itemCount: true }),
}).openapi('Item')

export type ItemListColumn = keyof Pick<SchemaType<typeof ItemSchema>, 'id' | 'name' | 'type'>;
export const sortableItemColumns: ItemListColumn[] = [
  'id',
  'name',
  'type'
]

export const ItemFilterSchema = SearchSchema
  .merge(SortSchema(sortableItemColumns))
  .merge(PaginationSchema)
  .extend({
    type: new EnumSchema('Type', ItemTypeEnum).getSchema().optional(),
    categoryId: new StringSchema('Product ID').neutralNumeric().getSchema().optional(),
  })
  .openapi('ItemFilter')

export const ItemResponseListSchema = ApiResponseListSchema(new ArraySchema('Item list', ItemSchema).getSchema(), tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'item',
      mode: 'plural'
    })
  }
})).openapi('ItemResponseList')
export const ItemResponseDataSchema = ApiResponseDataSchema(ItemSchema, tMessage({
  lang: 'en',
  key: 'successDetail',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'item',
    })
  }
})).openapi('ItemResponseData')

export const ItemRequestSchema = createInsertSchema(items, {
  categoryId: new NumberSchema('Category ID').natural().getSchema(),
  name: new StringSchema('Name').getSchema(),
  unitId: new NumberSchema('Unit ID').natural().getSchema(),
  type: new EnumSchema('Type', ItemTypeEnum).getSchema()
}).pick({
  name: true,
  type: true,
  unitId: true,
  categoryId: true,
}).openapi('ItemRequest')

export type Item = SchemaType<typeof ItemSchema>
export type ItemFilter = SchemaType<typeof ItemFilterSchema>
export type ItemRequest = SchemaType<typeof ItemRequestSchema>