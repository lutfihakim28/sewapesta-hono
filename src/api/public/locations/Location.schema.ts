import { z } from 'zod';

export const LocationSchema = z.object({
  subdistrict: z.string(),
  district: z.string(),
  city: z.string(),
  province: z.string(),
}).openapi('Location')