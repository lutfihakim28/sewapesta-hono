import { StringSchema } from '@/utils/schemas/String.schema'
import { z } from 'zod'

export const LocationSchema = z.object({
  subdistrict: new StringSchema('Subdistrict').getSchema(),
  subdistrictCode: new StringSchema('Subdistrict code').getSchema(),
  district: new StringSchema('District').getSchema(),
  districtCode: new StringSchema('District code').getSchema(),
  city: new StringSchema('City').getSchema(),
  cityCode: new StringSchema('City code').getSchema(),
  province: new StringSchema('Province').getSchema(),
  provinceCode: new StringSchema('Province code').getSchema(),
}).openapi('Location')

export type Location = z.infer<typeof LocationSchema>