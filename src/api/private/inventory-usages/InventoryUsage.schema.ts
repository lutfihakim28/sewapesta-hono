import { inventoryUsages } from 'db/schema/inventory-usages';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ItemSchema } from '../items/Item.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { DateRangeSchema } from '@/utils/schemas/DateRange.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { messages } from '@/utils/constants/messages';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';

export type InventoryUsageColumn = keyof typeof inventoryUsages.$inferSelect;

export const InventoryUsageSchema = createSelectSchema(inventoryUsages).pick({
  description: true,
  id: true,
  inventoryId: true,
  itemId: true,
  orderQuantity: true,
  returnAt: true,
  usedAt: true,
  returnQuantity: true,
}).openapi('InventoryUsage')

const InventoryUsageListItemSchema = InventoryUsageSchema.extend({
  item: ItemSchema.pick({ id: true, name: true }),
  owner: UserExtendedSchema.pick({ id: true, name: true }),
})

const InventoryUsageListSchema = new ArraySchema('Inventory usage list', InventoryUsageListItemSchema).getSchema().openapi('InventoryUsageList')
export const InventoryUsageFilterSchema = PaginationSchema
  .merge(SearchSchema)
  .merge(DateRangeSchema)
  .extend({
    ownerId: new StringSchema('Owner ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
    itemId: new StringSchema('Item ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
  })
  .openapi('InventoryUsageFilter')

export const InventoryUsageResponseListSchema = ApiResponseListSchema(InventoryUsageListSchema, messages.successList('inventory usages'))
export const InventoryUsageResponseDataSchema = ApiResponseDataSchema(InventoryUsageSchema, messages.successDetail('inventory usages'))

export const InventoryUsageRequestSchema = createInsertSchema(inventoryUsages, {
  description: new StringSchema('Description').getSchema().optional(),
  inventoryId: new NumberSchema('Inventory ID').natural().getSchema(),
  orderQuantity: new NumberSchema('Order quantity').natural().getSchema(),
  returnAt: new NumberSchema('Return at').natural().getSchema(),
  usedAt: new NumberSchema('Used at').natural().getSchema(),
  returnQuantity: new NumberSchema('Return quantity').natural().getSchema(),
}).pick({
  description: true,
  inventoryId: true,
  orderQuantity: true,
  returnAt: true,
  usedAt: true,
  returnQuantity: true,
}).openapi('InventoryUsageRequest')

export type InventoryUsage = SchemaType<typeof InventoryUsageSchema>
export type InventoryUsageList = SchemaType<typeof InventoryUsageListSchema>
export type InventoryUsageFilter = SchemaType<typeof InventoryUsageFilterSchema>
export type InventoryUsageRequest = SchemaType<typeof InventoryUsageRequestSchema>