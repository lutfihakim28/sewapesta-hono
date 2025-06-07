import { ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema';
import { districts } from 'db/schema/districts';
import { createSelectSchema } from 'drizzle-zod';
import { SchemaType } from '@/utils/types/Schema.type';
import { ArraySchema } from '@/utils/schemas/Array.schema';
import { tMessage, tData } from '@/utils/constants/locales/locale';
import { ObjectSchema } from '@/utils/schemas/Object.schema';
import { StringSchema } from '@/utils/schemas/String.schema';

const DistrictSchema = createSelectSchema(districts)
  .openapi('District');

const DistrictListSchema = new ArraySchema('District list', DistrictSchema).getSchema();
export const DistrictResponseListSchema = ApiResponseListSchema(DistrictListSchema, tMessage({
  lang: 'en',
  key: 'successList',
  textCase: 'sentence',
  params: {
    data: tData({
      lang: 'en',
      key: 'district',
      mode: 'plural'
    })
  }
}))

export const DistrictFilterSchema = new ObjectSchema({
  cityCode: new StringSchema('City code').cityCode().getSchema()
}).getSchema().openapi('DistrictFilter')

export type District = SchemaType<typeof DistrictSchema>
export type DistrictFilter = SchemaType<typeof DistrictFilterSchema>