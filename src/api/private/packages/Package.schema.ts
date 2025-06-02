import { messages } from '@/utils/constants/locales/messages';
import { validationMessages } from '@/utils/constants/validation-message';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { SortSchema } from '@/utils/schemas/Sort.schema';
import { packages } from 'db/schema/packages';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { UserExtendedSchema } from '../users/User.schema';
import { ProductSchema } from '../products/Product.schema';
import { StringSchema } from '@/utils/schemas/String.schema';
import { NumberSchema } from '@/utils/schemas/Number.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { EnumSchema } from '@/utils/schemas/Enum.schema';
import { BooleanSchema } from '@/utils/schemas/Boolean.schema';
import { ArraySchema } from '@/utils/schemas/Array.schema';

export type PackageColumn = keyof typeof packages.$inferSelect;

export const PackageSchema = createSelectSchema(packages).pick({
  id: true,
  // includeEmployee: true,
  name: true,
  // ownerId: true,
  // ownerPrice: true,
  // ownerRatio: true,
  price: true,
  productId: true,
  // term: true,
}).openapi('Package')

const PackageListItemSchema = PackageSchema.extend({
  // owner: UserExtendedSchema.pick({
  //   id: true,
  //   phone: true,
  //   name: true,
  // }),
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
    // ownerId: new StringSchema('Owner ID').neutralNumeric().getSchema().optional(),
    productId: new StringSchema('Product ID').neutralNumeric().getSchema().optional(),
    // term: new EnumSchema('Term', PackageTermEnum).getSchema().optional()
  })
  .openapi('PackageFilter')

export const PackageRequestSchema = createInsertSchema(packages, {
  // includeEmployee: new BooleanSchema('Include employee').getSchema(),
  name: new StringSchema('Name').getSchema(),
  // ownerId: new NumberSchema('Owner ID').natural().getSchema(),
  // ownerPrice: new NumberSchema('Owner price').whole().getSchema(),
  // ownerRatio: new NumberSchema('Owner ratio').nonnegative().getSchema(),
  price: new NumberSchema('Price').whole().getSchema(),
  productId: new NumberSchema('Product ID').natural().getSchema(),
  // term: new EnumSchema('Term', PackageTermEnum).getSchema(),
}).pick({
  // includeEmployee: true,
  name: true,
  // ownerId: true,
  // ownerPrice: true,
  // ownerRatio: true,
  price: true,
  productId: true,
  // term: true,
}).openapi('PackageRequest')

export const PackageResponseListSchema = ApiResponseListSchema(PackageListSchema, messages.successList('packages'))
export const PackageResponseDataSchema = ApiResponseDataSchema(PackageSchema, messages.successDetail('package'))

export type Package = SchemaType<typeof PackageSchema>
export type PackageList = SchemaType<typeof PackageListSchema>
export type PackageFilter = SchemaType<typeof PackageFilterSchema>
export type PackageRequest = SchemaType<typeof PackageRequestSchema>