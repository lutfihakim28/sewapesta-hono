import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { subdistricts } from 'db/schema/subdistricts';
import { createSelectSchema } from 'drizzle-zod';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';
import { ObjectSchema } from '@/utils/schemas/Object.schema';
import { StringSchema } from '@/utils/schemas/String.schema';

const SubdistrictSchema = createSelectSchema(subdistricts)
  .openapi('SubdistrictBase');

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

export const SubdistrictFilterSchema = new ObjectSchema({
  districtCode: new StringSchema('District code').districtCode().getSchema()
}).getSchema().openapi('SubdistrictFilter')

export type Subdistrict = SchemaType<typeof SubdistrictSchema>
export type SubdistrictFilter = SchemaType<typeof SubdistrictFilterSchema>