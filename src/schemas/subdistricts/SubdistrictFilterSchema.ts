import { z } from 'zod';
import { SearchSchema } from '../SearchSchema';
import { PaginationSchema } from '../PaginationSchema';

export const SubdistrictFilterSchema = z
  .object({
    districtCode: z.string().openapi({ example: '33.74.12' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('SubdistrictFilter')

export type SubdistrictFilter = z.infer<typeof SubdistrictFilterSchema>