import { messages } from '@/utils/constants/messages';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { districts } from 'db/schema/districts';
import { createSelectSchema } from 'drizzle-zod';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { z } from 'zod';
import { ArraySchema } from '@/utils/schemas/Array.schema';

const DistrictSchema = createSelectSchema(districts)
  .omit({ cityCode: true })
  .openapi('District');
// export const DistrictExtendedSchema = DistrictSchema
//   .extend({
//     city: CityExtendedSchema,
//   })
//   .openapi('DistrictExtended');
export const DistrictFilterSchema = z
  .object({
    cityCode: new StringSchema('City code').getSchema().openapi({ example: '33.74' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('DistrictFilter')
const DistrictListSchema = new ArraySchema('District list', DistrictSchema).getSchema();
export const DistrictResponseListSchema = ApiResponseListSchema(DistrictListSchema, messages.successList('districts'))

export type District = SchemaType<typeof DistrictSchema>
export type DistrictFilter = SchemaType<typeof DistrictFilterSchema>