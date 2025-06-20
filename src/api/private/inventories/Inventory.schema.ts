import { inventories } from 'db/schema/inventories';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { CategorySchema } from '../categories/Category.schema';
import { ItemSchema } from '../items/Item.schema';
import { UnitSchema } from '../units/Unit.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';

export type InventoryColumn = keyof typeof inventories.$inferSelect;

export const InventorySchema = createSelectSchema(inventories).pick({
  id: true,
  itemId: true,
  ownerId: true,
}).openapi('Inventory')

const InventoryListItemSchema = InventorySchema.extend({
  item: ItemSchema.pick({
    id: true,
    name: true,
    type: true
  }),
  category: CategorySchema.pick({
    id: true,
    name: true,
  }),
  unit: UnitSchema,
  owner: UserExtendedSchema.pick({
    id: true,
    phone: true,
    name: true,
  })
});

export type InventoryListColumn = keyof Pick<SchemaType<typeof InventoryListItemSchema>, 'id' | 'item' | 'owner'>

export const sortableInventoryColumns: InventoryListColumn[] = [
  'id',
  'item',
  'owner'
]

export const InventoryListSchema = new ArraySchema('Inventory list', InventoryListItemSchema).getSchema().openapi('InventoryList')

export const InventoryFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .merge(SortSchema(sortableInventoryColumns))
  .extend({
    itemId: new StringSchema('Item ID').neutralNumeric().getSchema().optional(),
    ownerId: new StringSchema('Owner ID').neutralNumeric().getSchema().optional(),
    categoryId: new StringSchema('Category ID').neutralNumeric().getSchema().optional(),
  })
  .openapi('InventoryFilter')

export const InventoryRequestSchema = createInsertSchema(inventories, {
  ownerId: new NumberSchema('Owner ID').natural().getSchema(),
  itemId: new NumberSchema('Item ID').natural().getSchema(),
})
  .pick({
    itemId: true,
    ownerId: true,
  })
  .openapi('InventoryRequest')

export const InventoryResponseListSchema = ApiResponseListSchema(InventoryListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'inventory',
      mode: 'plural'
    })
  }
}))
export const InventoryResponseDataSchema = ApiResponseDataSchema(InventorySchema, tMessage({
  lang: 'en',
  key: 'errorNotFound',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'withId',
      params: {
        data: tData({
          lang: 'en',
          key: 'inventory',
        }),
        value: 1
      }
    })
  }
}))

export type Inventory = SchemaType<typeof InventorySchema>
export type InventoryList = SchemaType<typeof InventoryListSchema>
export type InventoryFilter = SchemaType<typeof InventoryFilterSchema>
export type InventoryRequest = SchemaType<typeof InventoryRequestSchema>
