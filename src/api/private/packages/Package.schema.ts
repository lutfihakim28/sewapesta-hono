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

export const PackageListSchema = z.array(PackageSchema.extend({
  ownerName: z.string(),
  ownerPhone: z.string(),
  productName: z.string().nullable(),
})).openapi('PackageList')

export const PackageFilterSchema = SearchSchema
  .merge(SortSchema<PackageColumn>([
    'id',
    'name',
    'price'
  ]))
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
    invalid_type_error: validationMessages.number('Owner Price'),
    required_error: validationMessages.required('Owner Price')
  }),
  ownerRatio: z.number({
    invalid_type_error: validationMessages.number('Owner Ratio'),
    required_error: validationMessages.required('Owner Ratio')
  }),
  price: z.number({
    invalid_type_error: validationMessages.number('Price'),
    required_error: validationMessages.required('Price')
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