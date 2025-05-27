import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { UserExtendedSchema } from '../users/User.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { messages } from '@/utils/constants/messages';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { ownerRevenueTerms } from 'db/schema/owner-revenue-terms';
import { SortSchema } from '@/utils/schemas/Sort.schema';

export type OwnerRevenueTermColumn = keyof typeof ownerRevenueTerms.$inferSelect;

export const OwnerRevenueTermSchema = createSelectSchema(ownerRevenueTerms).pick({
  id: true,
  ownerId: true,
  employeeRatio: true,
  ownerRatio: true,
}).openapi('OwnerRevenueTerm')

const OwnerRevenueTermListOwnerSchema = OwnerRevenueTermSchema.extend({
  owner: UserExtendedSchema.pick({ id: true, name: true }),
})

export type OwnerRevenueTermListColumn = keyof Pick<SchemaType<
  typeof OwnerRevenueTermListOwnerSchema>,
  'id' |
  'owner' |
  'employeeRatio' |
  'ownerRatio'
>

export const sortableOwnerRevenueTermColumns: OwnerRevenueTermListColumn[] = [
  'id',
  'owner',
  'employeeRatio',
  'ownerRatio',
]

const OwnerRevenueTermListSchema = new ArraySchema('Owner revenue term list', OwnerRevenueTermListOwnerSchema).getSchema().openapi('OwnerRevenueTermList')

export const OwnerRevenueTermFilterSchema = PaginationSchema
  .merge(SearchSchema)
  .merge(SortSchema(sortableOwnerRevenueTermColumns))
  .extend({
    ownerId: new StringSchema('Owner ID').neutralNumeric().getSchema().optional(),
  })
  .openapi('OwnerRevenueTermFilter')

export const OwnerRevenueTermResponseListSchema = ApiResponseListSchema(OwnerRevenueTermListSchema, messages.successList('inventory usages'))
export const OwnerRevenueTermResponseDataSchema = ApiResponseDataSchema(OwnerRevenueTermSchema, messages.successDetail('inventory usages'))

export const OwnerRevenueTermRequestSchema = createInsertSchema(ownerRevenueTerms, {
  ownerId: new NumberSchema('Owner ID').natural().getSchema(),
  employeeRatio: new NumberSchema('Employee price').natural().getSchema(),
  ownerRatio: new NumberSchema('Owner price').natural().getSchema(),
}).pick({
  ownerId: true,
  employeeRatio: true,
  ownerRatio: true,
}).openapi('OwnerRevenueTermRequest')

export type OwnerRevenueTerm = SchemaType<typeof OwnerRevenueTermSchema>
export type OwnerRevenueTermList = SchemaType<typeof OwnerRevenueTermListSchema>
export type OwnerRevenueTermFilter = SchemaType<typeof OwnerRevenueTermFilterSchema>
export type OwnerRevenueTermRequest = SchemaType<typeof OwnerRevenueTermRequestSchema>