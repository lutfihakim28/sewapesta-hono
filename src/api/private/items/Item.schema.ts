import { items } from 'db/schema/items';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { UnitSchema } from '../units/Unit.schema';
import { CategorySchema } from '../categories/Category.schema';
import { z } from 'zod';
import { ItemTypeEnum } from '@/utils/enums/ItemTypeEnum';
import { validationMessages } from '@/utils/constants/validation-message';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { messages } from '@/utils/constants/messages';
import { StringSchema } from '@/utils/schemas/String.schema';

export type ItemColumn = keyof typeof items.$inferSelect;

export const ItemSchema = createSelectSchema(items).pick({
  id: true,
  name: true,
  type: true,
}).extend({
  unit: UnitSchema,
  category: CategorySchema,
}).openapi('Item')

export type ItemListColumn = keyof Pick<z.infer<typeof ItemSchema>, 'id' | 'name' | 'type'>;
export const sortableItemColumns: ItemListColumn[] = [
  'id',
  'name',
  'type'
]

export const ItemFilterSchema = z.object({
  type: z.nativeEnum(ItemTypeEnum, {
    invalid_type_error: validationMessages.enum('Type', ItemTypeEnum)
  }).optional(),
  categoryId: new StringSchema('Product ID').numeric({ min: 1 }).optional(),
})
  .merge(SearchSchema)
  .merge(SortSchema(sortableItemColumns))
  .merge(PaginationSchema)
  .openapi('ItemFilter')

export const ItemResponseListSchema = ApiResponseListSchema(z.array(ItemSchema), messages.successList('items')).openapi('ItemResponseList')
export const ItemResponseDataSchema = ApiResponseDataSchema(ItemSchema, messages.successDetail('item')).openapi('ItemResponseData')

export const ItemRequestSchema = createInsertSchema(items, {
  categoryId: z.number({
    invalid_type_error: validationMessages.number('Category ID'),
    required_error: validationMessages.required('Category ID')
  })
    .int({
      message: validationMessages.integer('Category ID')
    })
    .positive({
      message: validationMessages.positiveNumber('Category ID')
    }),
  name: new StringSchema('Name').schema,
  unitId: z.number({
    invalid_type_error: validationMessages.number('Unit ID'),
    required_error: validationMessages.required('Unit ID')
  })
    .int({
      message: validationMessages.integer('Unit ID')
    })
    .positive({
      message: validationMessages.positiveNumber('Unit ID')
    }),
  type: z.nativeEnum(ItemTypeEnum, {
    invalid_type_error: validationMessages.enum('Type', ItemTypeEnum),
    required_error: validationMessages.required('Type')
  })
}).pick({
  name: true,
  type: true,
  unitId: true,
  categoryId: true,
}).openapi('ItemRequest')

export type Item = z.infer<typeof ItemSchema>
export type ItemFilter = z.infer<typeof ItemFilterSchema>
export type ItemRequest = z.infer<typeof ItemRequestSchema>