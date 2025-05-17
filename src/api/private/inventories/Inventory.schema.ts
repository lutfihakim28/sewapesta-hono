import { inventories } from 'db/schema/inventories';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { CategorySchema } from '../categories/Category.schema';
import { ItemSchema } from '../items/Item.schema';
import { UnitSchema } from '../units/Unit.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { validationMessages } from '@/utils/constants/validation-message';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { messages } from '@/utils/constants/messages';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';

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
  category: CategorySchema,
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
    itemId: new StringSchema('Item ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
    ownerId: new StringSchema('Owner ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
    categoryId: new StringSchema('Category ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
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

export const InventoryResponseListSchema = ApiResponseListSchema(InventoryListSchema, messages.successList('inventory items'))
export const InventoryResponseDataSchema = ApiResponseDataSchema(InventorySchema, messages.successDetail('inventory item'))

export type Inventory = SchemaType<typeof InventorySchema>
export type InventoryList = SchemaType<typeof InventoryListSchema>
export type InventoryFilter = SchemaType<typeof InventoryFilterSchema>
export type InventoryRequest = SchemaType<typeof InventoryRequestSchema>
