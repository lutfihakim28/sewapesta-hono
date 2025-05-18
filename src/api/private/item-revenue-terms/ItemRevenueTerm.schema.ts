import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ItemSchema } from '../items/Item.schema';
import { UserExtendedSchema } from '../users/User.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { messages } from '@/utils/constants/messages';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { itemRevenueTerms } from 'db/schema/item-revenue-terms';
import { EnumSchema } from '@/utils/schemas/Enum.schema';
import { TermPriceTypeEnum } from '@/utils/enums/TermPriceTypeEnum';
import { SortSchema } from '@/utils/schemas/Sort.schema';

export type ItemRevenueTermColumn = keyof typeof itemRevenueTerms.$inferSelect;

export const ItemRevenueTermSchema = createSelectSchema(itemRevenueTerms).pick({
  id: true,
  ownerId: true,
  itemId: true,
  employeeFixedPrice: true,
  employeeRatioPrice: true,
  employeePriceType: true,
  ownerFixedPrice: true,
  ownerRatioPrice: true,
  ownerPriceType: true,
}).openapi('ItemRevenueTerm')

const ItemRevenueTermListItemSchema = ItemRevenueTermSchema.extend({
  item: ItemSchema.pick({ id: true, name: true }),
  owner: UserExtendedSchema.pick({ id: true, name: true }),
})

export type ItemRevenueTermListColumn = keyof Pick<SchemaType<
  typeof ItemRevenueTermListItemSchema>,
  'id' |
  'item' |
  'owner' |
  'employeeFixedPrice' |
  'employeeRatioPrice' |
  'ownerFixedPrice' |
  'ownerRatioPrice'
>

export const sortableItemRevenueTermColumns: ItemRevenueTermListColumn[] = [
  'id',
  'item',
  'owner',
  'employeeFixedPrice',
  'employeeRatioPrice',
  'ownerFixedPrice',
  'ownerRatioPrice'
]

const ItemRevenueTermListSchema = new ArraySchema('Item revenue term list', ItemRevenueTermListItemSchema).getSchema().openapi('ItemRevenueTermList')

export const ItemRevenueTermFilterSchema = PaginationSchema
  .merge(SearchSchema)
  .merge(SortSchema(sortableItemRevenueTermColumns))
  .extend({
    ownerId: new StringSchema('Owner ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
    itemId: new StringSchema('Item ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
  })
  .openapi('ItemRevenueTermFilter')

export const ItemRevenueTermResponseListSchema = ApiResponseListSchema(ItemRevenueTermListSchema, messages.successList('inventory usages'))
export const ItemRevenueTermResponseDataSchema = ApiResponseDataSchema(ItemRevenueTermSchema, messages.successDetail('inventory usages'))

export const ItemRevenueTermRequestSchema = createInsertSchema(itemRevenueTerms, {
  ownerId: new NumberSchema('Owner ID').natural().getSchema(),
  itemId: new NumberSchema('Item ID').natural().getSchema(),
  employeeFixedPrice: new NumberSchema('Employee fixed price').natural().getSchema(),
  employeeRatioPrice: new NumberSchema('Employee ratio price').positive().getSchema(),
  employeePriceType: new EnumSchema('Employee price type', TermPriceTypeEnum).getSchema(),
  ownerFixedPrice: new NumberSchema('Owner fixed price').natural().getSchema(),
  ownerRatioPrice: new NumberSchema('Owner ratio price').positive().getSchema(),
  ownerPriceType: new EnumSchema('Owner price type', TermPriceTypeEnum).getSchema(),
}).pick({
  ownerId: true,
  itemId: true,
  employeeFixedPrice: true,
  employeeRatioPrice: true,
  employeePriceType: true,
  ownerFixedPrice: true,
  ownerRatioPrice: true,
  ownerPriceType: true,
}).openapi('ItemRevenueTermRequest')

export type ItemRevenueTerm = SchemaType<typeof ItemRevenueTermSchema>
export type ItemRevenueTermList = SchemaType<typeof ItemRevenueTermListSchema>
export type ItemRevenueTermFilter = SchemaType<typeof ItemRevenueTermFilterSchema>
export type ItemRevenueTermRequest = SchemaType<typeof ItemRevenueTermRequestSchema>