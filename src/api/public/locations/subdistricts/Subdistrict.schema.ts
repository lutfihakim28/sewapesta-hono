import { messages } from '@/utils/constants/messages';
import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { subdistricts } from 'db/schema/subdistricts';
import { createSelectSchema } from 'drizzle-zod';
import { validationMessages } from '@/utils/constants/validation-message';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { z } from 'zod';
import { ArraySchema } from '@/utils/schemas/Array.schema';

const SubdistrictSchema = createSelectSchema(subdistricts)
  .omit({ districtCode: true })
  .openapi('SubdistrictBase');
// export const SubdistrictExtendedSchema = SubdistrictSchema
//   .extend({
//     district: DistrictExtendedSchema,
//   })
//   .openapi('SubdistrictExtended');
export const SubdistrictFilterSchema = z
  .object({
    districtCode: new StringSchema('District code').getSchema().openapi({ example: '33.74.12' })
  })
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('SubdistrictFilter')
const SubdistrictListSchema = new ArraySchema('Subdistrict list', SubdistrictSchema).getSchema()
export const SubdistrictResponseListSchema = ApiResponseListSchema(SubdistrictListSchema, messages.successList('subdistricts'))

export type Subdistrict = SchemaType<typeof SubdistrictSchema>
export type SubdistrictFilter = SchemaType<typeof SubdistrictFilterSchema>