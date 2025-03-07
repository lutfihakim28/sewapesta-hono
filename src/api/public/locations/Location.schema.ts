import { z } from 'zod';

export const LocationSchema = z.object({
  subdistrict: z.string(),
  subdistrictCode: z.string(),
  district: z.string(),
  districtCode: z.string(),
  city: z.string(),
  cityCode: z.string(),
  province: z.string(),
  provinceCode: z.string(),
}).openapi('Location')