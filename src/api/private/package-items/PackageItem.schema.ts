import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { packageItems } from 'db/schema/package-items';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { PackageSchema } from '../packages/Package.schema';
import { ItemSchema } from '../items/Item.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';

export type PackageItemColumn = keyof typeof packageItems.$inferSelect;

export const PackageItemSchema = createSelectSchema(packageItems).pick({
  id: true,
  itemId: true,
  packageId: true,
  quantity: true,
  // reference: true,
  // referenceId: true,
}).openapi('PackageItem')

const PackageItemListItemSchema = PackageItemSchema.extend({
  // owner: UserExtendedSchema.pick({
  //   id: true,
  //   phone: true,
  //   name: true,
  // }),
  item: ItemSchema.pick({
    id: true,
    name: true,
  }),
  package: PackageSchema.pick({
    id: true,
    name: true,
  })
})

export type PackageItemListColumn = keyof Pick<SchemaType<typeof PackageItemListItemSchema>, 'id' | 'quantity' | 'package' | 'item'>

export const sortablePackageItemColumns: PackageItemListColumn[] = [
  'id', 'quantity', 'package', 'item'
]

export const PackageItemListSchema = new ArraySchema('PackageItem list', PackageItemListItemSchema).getSchema().openapi('PackageItemList')

export const PackageItemFilterSchema = SearchSchema
  .merge(SortSchema(sortablePackageItemColumns))
  .merge(PaginationSchema)
  .extend({
    itemId: new StringSchema('item ID').neutralNumeric().getSchema().optional(),
    // ownerId: new StringSchema('Owner ID').neutralNumeric().getSchema().optional(),
    productId: new StringSchema('Product ID').neutralNumeric().getSchema().optional(),
    // reference: new EnumSchema('Reference', ItemTypeEnum).getSchema().optional()
  })
  .openapi('PackageItemFilter')

export const PackageItemRequestSchema = createInsertSchema(packageItems, {
  itemId: new NumberSchema('Item ID').natural().getSchema(),
  packageId: new NumberSchema('Package ID').integer().getSchema(),
  quantity: new NumberSchema('Quantity').whole().getSchema(),
  // referenceId: new NumberSchema('Reference ID').natural().getSchema(),
  // reference: new EnumSchema('Reference', ItemTypeEnum).getSchema(),
}).pick({
  itemId: true,
  packageId: true,
  quantity: true,
  // reference: true,
  // referenceId: true,
}).openapi('PackageItemRequest')

export const PackageItemResponseListSchema = ApiResponseListSchema(PackageItemListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'packageItem',
      mode: 'plural'
    })
  }
}))
export const PackageItemResponseDataSchema = ApiResponseDataSchema(PackageItemSchema, tMessage({
  lang: 'en',
  key: 'successDetail',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'packageItem',
    })
  }
}))

export type PackageItem = SchemaType<typeof PackageItemSchema>
export type PackageItemList = SchemaType<typeof PackageItemListSchema>
export type PackageItemFilter = SchemaType<typeof PackageItemFilterSchema>
export type PackageItemRequest = SchemaType<typeof PackageItemRequestSchema>