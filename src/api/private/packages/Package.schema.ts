import { messages } from '@/lib/constants/messages';
import { validationMessages } from '@/lib/constants/validation-message';
import { PackageTermEnum } from '@/lib/enums/PackageTermEnum';
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema';
import { NumericSchema } from '@/lib/schemas/Numeric.schema';
import { PaginationSchema } from '@/lib/schemas/Pagination.schema';
import { SearchSchema } from '@/lib/schemas/Search.schema';
import { SortSchema } from '@/lib/schemas/Sort.schema';
import { packages } from 'db/schema/packages';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { UserExtendedSchema } from '../users/User.schema';
import { ProductSchema } from '../products/Product.schema';

export type PackageColumn = keyof typeof packages.$inferSelect;

export const PackageSchema = createSelectSchema(packages).pick({
  id: true,
  includeEmployee: true,
  name: true,
  ownerId: true,
  ownerPrice: true,
  ownerRatio: true,
  price: true,
  productId: true,
  term: true,
}).openapi('Package')

const PackageListItemSchema = PackageSchema.extend({
  owner: UserExtendedSchema.pick({
    id: true,
    phone: true,
    name: true,
  }),
  product: ProductSchema.pick({
    id: true,
    name: true,
  }).nullable()
})

export type PackageListColumn = keyof Pick<z.infer<typeof PackageListItemSchema>, 'id' | 'name' | 'owner' | 'price' | 'product'>

export const sortablePackageColumns: PackageListColumn[] = [
  'id', 'name', 'owner', 'price', 'product'
]

export const PackageListSchema = z.array(PackageListItemSchema).openapi('PackageList')

export const PackageFilterSchema = SearchSchema
  .merge(SortSchema(sortablePackageColumns))
  .merge(PaginationSchema)
  .extend({
    ownerId: NumericSchema('Owner ID').optional(),
    productId: NumericSchema('Product ID').optional(),
    term: z.nativeEnum(PackageTermEnum, {
      invalid_type_error: validationMessages.enum('Term', PackageTermEnum)
    }).optional()
  })
  .openapi('PackageFilter')

export const PackageRequestSchema = createInsertSchema(packages, {
  includeEmployee: z.boolean({
    invalid_type_error: validationMessages.boolean('Include employee'),
    required_error: validationMessages.required('Include employee')
  }),
  name: z.string({
    invalid_type_error: validationMessages.string('Name'),
    required_error: validationMessages.required('Name'),
  }),
  ownerId: z.number({
    invalid_type_error: validationMessages.number('Owner ID'),
    required_error: validationMessages.required('Owner ID')
  }).positive({
    message: validationMessages.positiveNumber('Owner ID')
  }),
  ownerPrice: z.number({
    invalid_type_error: validationMessages.number('Owner price'),
    required_error: validationMessages.required('Owner price')
  }).nonnegative({
    message: validationMessages.nonNegativeNumber('Owner price')
  }),
  ownerRatio: z.number({
    invalid_type_error: validationMessages.number('Owner ratio'),
    required_error: validationMessages.required('Owner ratio')
  }).nonnegative({
    message: validationMessages.nonNegativeNumber('Owner ratio')
  }),
  price: z.number({
    invalid_type_error: validationMessages.number('Price'),
    required_error: validationMessages.required('Price')
  }).nonnegative({
    message: validationMessages.nonNegativeNumber('price')
  }),
  productId: z.number({
    invalid_type_error: validationMessages.number('Product ID'),
  }),
  term: z.nativeEnum(PackageTermEnum, {
    invalid_type_error: validationMessages.enum('Term', PackageTermEnum),
    required_error: validationMessages.required('Term')
  }),
}).pick({
  includeEmployee: true,
  name: true,
  ownerId: true,
  ownerPrice: true,
  ownerRatio: true,
  price: true,
  productId: true,
  term: true,
}).openapi('PackageRequest')

export const PackageResponseListSchema = ApiResponseListSchema(PackageListSchema, messages.successList('packages'))
export const PackageResponseDataSchema = ApiResponseDataSchema(PackageSchema, messages.successDetail('package'))

export type Package = z.infer<typeof PackageSchema>
export type PackageList = z.infer<typeof PackageListSchema>
export type PackageFilter = z.infer<typeof PackageFilterSchema>
export type PackageRequest = z.infer<typeof PackageRequestSchema>