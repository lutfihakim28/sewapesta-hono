import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { packages } from 'db/schema/packages';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ProductSchema } from '../products/Product.schema';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';
import { OptionSchema } from '@/utils/schemas/Option.schema';
import { ObjectSchema } from '@/utils/schemas/Object.schema';

export type PackageColumn = keyof typeof packages.$inferSelect;

export const PackageSchema = createSelectSchema(packages).pick({
  id: true,
  name: true,
  price: true,
  productId: true,
}).openapi('Package')

const PackageListItemSchema = PackageSchema.extend({
  product: ProductSchema.pick({
    id: true,
    name: true,
  }).nullable()
})

export type PackageListColumn = keyof Pick<SchemaType<typeof PackageListItemSchema>, 'id' | 'name' | 'price' | 'product'>

export const sortablePackageColumns: PackageListColumn[] = [
  'id', 'name', 'price', 'product'
]

export const PackageListSchema = new ArraySchema('Package list', PackageListItemSchema).getSchema().openapi('PackageList')

export const PackageFilterSchema = SearchSchema
  .merge(SortSchema(sortablePackageColumns))
  .merge(PaginationSchema)
  .extend({
    productId: new StringSchema('Product ID').neutralNumeric().getSchema().optional(),
  })
  .openapi('PackageFilter')

export const PackageRequestSchema = createInsertSchema(packages, {
  name: new StringSchema('Name').getSchema(),
  price: new NumberSchema('Price').whole().getSchema(),
  productId: new NumberSchema('Product ID').natural().getSchema(),
}).pick({
  name: true,
  price: true,
  productId: true,
}).openapi('PackageRequest')

export const PackageWithItemsRequestSchema = new ObjectSchema({
  name: new StringSchema('Name').getSchema(),
  price: new NumberSchema('Price').whole().getSchema(),
  productId: new NumberSchema('Product ID').natural().getSchema(),
  items: new ArraySchema('Items', new ObjectSchema({
    itemId: new NumberSchema('Item ID').natural().getSchema(),
    quantity: new NumberSchema('Quantity').whole().getSchema(),
  }).getSchema()).nonempty().getSchema(),
}).getSchema().openapi('PackageWithItemsRequest');

export const PackageResponseListSchema = ApiResponseListSchema(PackageListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'package',
      mode: 'plural'
    })
  }
}))
export const PackageResponseDataSchema = ApiResponseDataSchema(PackageSchema, tMessage({
  lang: 'en',
  key: 'successDetail',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'package',
    })
  }
}))

export const PackageOptionResponseSchema = ApiResponseDataSchema(new ArraySchema('Category options', OptionSchema).getSchema(), tMessage({
  key: 'successList',
  lang: 'en',
  textCase: 'sentence',
  params: {
    data: tData({ key: 'packageOptions', lang: 'en' })
  }
}))

export type Package = SchemaType<typeof PackageSchema>
export type PackageList = SchemaType<typeof PackageListSchema>
export type PackageFilter = SchemaType<typeof PackageFilterSchema>
export type PackageRequest = SchemaType<typeof PackageRequestSchema>
export type PackageWithItemsRequest = SchemaType<typeof PackageWithItemsRequestSchema>;