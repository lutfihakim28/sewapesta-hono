import { z } from 'zod';
import { SearchSchema } from '../SearchSchema';
import { PaginationSchema } from '../PaginationSchema';

export const DistrictFilterSchema = z
  .object({
    cityCode: z.string().openapi({ example: '33.74' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('DistrictFilter')

export type DistrictFilter = z.infer<typeof DistrictFilterSchema>