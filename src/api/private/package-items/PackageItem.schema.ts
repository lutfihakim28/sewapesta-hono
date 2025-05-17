import { messages } from '@/utils/constants/messages';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { packageItems } from 'db/schema/package-items';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { UserExtendedSchema } from '../users/User.schema';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { EnumSchema } from '@/utils/schemas/Enum.schema';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { PackageSchema } from '../packages/Package.schema';
import { ItemSchema } from '../items/Item.schema';
import { ItemTypeEnum } from '@/utils/enums/ItemTypeEnum';

export type PackageItemColumn = keyof typeof packageItems.$inferSelect;

export const PackageItemSchema = createSelectSchema(packageItems).pick({
  id: true,
  itemId: true,
  packageId: true,
  quantity: true,
  reference: true,
  referenceId: true,
}).openapi('PackageItem')

const PackageItemListItemSchema = PackageItemSchema.extend({
  owner: UserExtendedSchema.pick({
    id: true,
    phone: true,
    name: true,
  }),
  item: ItemSchema.pick({
    id: true,
    name: true,
  }),
  package: PackageSchema.pick({
    id: true,
    name: true,
  })
})

export type PackageItemListColumn = keyof Pick<SchemaType<typeof PackageItemListItemSchema>, 'id' | 'owner' | 'quantity' | 'package' | 'item'>

export const sortablePackageItemColumns: PackageItemListColumn[] = [
  'id', 'owner', 'quantity', 'package', 'item'
]

export const PackageItemListSchema = new ArraySchema('PackageItem list', PackageItemListItemSchema).getSchema().openapi('PackageItemList')

export const PackageItemFilterSchema = SearchSchema
  .merge(SortSchema(sortablePackageItemColumns))
  .merge(PaginationSchema)
  .extend({
    itemId: new StringSchema('item ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
    ownerId: new StringSchema('Owner ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
    productId: new StringSchema('Product ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
    reference: new EnumSchema('Reference', ItemTypeEnum).getSchema().optional()
  })
  .openapi('PackageItemFilter')

export const PackageItemRequestSchema = createInsertSchema(packageItems, {
  itemId: new NumberSchema('Item ID').natural().getSchema(),
  packageId: new NumberSchema('Package ID').integer().getSchema(),
  quantity: new NumberSchema('Quantity').whole().getSchema(),
  referenceId: new NumberSchema('Reference ID').natural().getSchema(),
  reference: new EnumSchema('Reference', ItemTypeEnum).getSchema(),
}).pick({
  itemId: true,
  packageId: true,
  quantity: true,
  reference: true,
  referenceId: true,
}).openapi('PackageItemRequest')

export const PackageItemResponseListSchema = ApiResponseListSchema(PackageItemListSchema, messages.successList('packageItems'))
export const PackageItemResponseDataSchema = ApiResponseDataSchema(PackageItemSchema, messages.successDetail('package'))

export type PackageItem = SchemaType<typeof PackageItemSchema>
export type PackageItemList = SchemaType<typeof PackageItemListSchema>
export type PackageItemFilter = SchemaType<typeof PackageItemFilterSchema>
export type PackageItemRequest = SchemaType<typeof PackageItemRequestSchema>