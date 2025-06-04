import { ObjectSchema } from '@/utils/schemas/Object.schema'
import { StringSchema } from '@/utils/schemas/String.schema'
import { SchemaType } from '@/utils/types/Schema.type'

export const LocationSchema = new ObjectSchema({
  subdistrict: new StringSchema('Subdistrict').getSchema(),
  subdistrictCode: new StringSchema('Subdistrict code').getSchema(),
  district: new StringSchema('District').getSchema(),
  districtCode: new StringSchema('District code').getSchema(),
  city: new StringSchema('City').getSchema(),
  cityCode: new StringSchema('City code').getSchema(),
  province: new StringSchema('Province').getSchema(),
  provinceCode: new StringSchema('Province code').getSchema(),
}).getSchema().openapi('Location')

export type Location = SchemaType<typeof LocationSchema>