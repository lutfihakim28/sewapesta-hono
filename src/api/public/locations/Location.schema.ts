import { StringSchema } from '@/utils/schemas/String.schema'
import { z } from 'zod'

export const LocationSchema = z.object({
  subdistrict: new StringSchema('Subdistrict').schema,
  subdistrictCode: new StringSchema('Subdistrict code').schema,
  district: new StringSchema('District').schema,
  districtCode: new StringSchema('District code').schema,
  city: new StringSchema('City').schema,
  cityCode: new StringSchema('City code').schema,
  province: new StringSchema('Province').schema,
  provinceCode: new StringSchema('Province code').schema,
}).openapi('Location')

export type Location = z.infer<typeof LocationSchema>