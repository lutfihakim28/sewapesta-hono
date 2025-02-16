import { z } from 'zod';
import { SearchSchema } from '../SearchSchema';
import { PaginationSchema } from '../PaginationSchema';

export const ProvinceFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .openapi('ProvinceFilter')

export type ProvinceFilter = z.infer<typeof ProvinceFilterSchema>