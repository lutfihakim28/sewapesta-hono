import { PaginationSchema } from '@/utils/schemas/Pagination.schema';
import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { SearchSchema } from '@/utils/schemas/Search.schema';
import { subdistricts } from 'db/schema/subdistricts';
import { createSelectSchema } from 'drizzle-zod';
import { StringSchema } from '@/utils/schemas/String.schema';
import { SchemaType } from '@/utils/types/Schema.type';
import { z } from 'zod';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';

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
export const SubdistrictResponseListSchema = ApiResponseListSchema(SubdistrictListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'subdistrict',
      mode: 'plural'
    })
  }
}))

export type Subdistrict = SchemaType<typeof SubdistrictSchema>
export type SubdistrictFilter = SchemaType<typeof SubdistrictFilterSchema>