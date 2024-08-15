import { z } from 'zod';
import { PaginationSchema } from '../PaginationSchema';
import { SortSchema } from '../SortSchema';
import { SearchSchema } from '../SearchSchema';
import { products } from 'db/schema/products';

export type PackageColumn = keyof typeof products.$inferSelect;

const _SortSchema = SortSchema<PackageColumn>([
  'id',
  'name',
  'price',
] as const);

export const ProductFilterSchema = _SortSchema
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('ProductFilter')

export type ProductFilter = z.infer<typeof ProductFilterSchema>