import { z } from 'zod';
import { SearchSchema } from '../SearchSchema';
import { PaginationSchema } from '../PaginationSchema';

export const CityFilterSchema = z
  .object({
    provinceCode: z.string().openapi({ example: '33' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('CityFilter')

export type CityFilter = z.infer<typeof CityFilterSchema>