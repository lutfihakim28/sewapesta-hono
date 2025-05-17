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
import { inventoryDamageReports } from 'db/schema/inventory-damage-reports';

export type inventoryDamageReportColumn = keyof typeof inventoryDamageReports.$inferSelect;

export const InventoryDamageReportSchema = createSelectSchema(inventoryDamageReports).pick({
  id: true,
  inventoryId: true,
  itemId: true,
  damagedAt: true,
  quantity: true
}).openapi('InventoryDamageReport')

const InventoryDamageReportListItemSchema = InventoryDamageReportSchema.extend({
  item: ItemSchema.pick({ id: true, name: true }),
  owner: UserExtendedSchema.pick({ id: true, name: true }),
})

const InventoryDamageReportListSchema = new ArraySchema('Inventory usage list', InventoryDamageReportListItemSchema).getSchema().openapi('InventoryDamageReportList')
export const InventoryDamageReportFilterSchema = PaginationSchema
  .merge(SearchSchema)
  .merge(DateRangeSchema)
  .extend({
    ownerId: new StringSchema('Owner ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
    itemId: new StringSchema('Item ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
  })
  .openapi('InventoryDamageReportFilter')

export const InventoryDamageReportResponseListSchema = ApiResponseListSchema(InventoryDamageReportListSchema, messages.successList('inventory usages'))
export const InventoryDamageReportResponseDataSchema = ApiResponseDataSchema(InventoryDamageReportSchema, messages.successDetail('inventory usages'))

export const InventoryDamageReportRequestSchema = createInsertSchema(inventoryDamageReports, {
  inventoryId: new NumberSchema('Inventory ID').natural().getSchema(),
  damagedAt: new NumberSchema('Damaged at').whole().getSchema(),
  quantity: new NumberSchema('Quantity').natural().getSchema(),
}).pick({
  inventoryId: true,
  damagedAt: true,
  quantity: true
}).openapi('InventoryDamageReportRequest')

export type InventoryDamageReport = SchemaType<typeof InventoryDamageReportSchema>
export type InventoryDamageReportList = SchemaType<typeof InventoryDamageReportListSchema>
export type InventoryDamageReportFilter = SchemaType<typeof InventoryDamageReportFilterSchema>
export type InventoryDamageReportRequest = SchemaType<typeof InventoryDamageReportRequestSchema>