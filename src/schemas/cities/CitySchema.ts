import { ProvinceSchema } from '@/schemas/provinces/ProvinceSchema';
import { z } from '@hono/zod-openapi';
import { cities } from 'db/schema/cities';
import { createSelectSchema } from 'drizzle-zod';

export const CitySchema = createSelectSchema(cities).extend({
  province: ProvinceSchema.optional(),
}).openapi('City')

export type City = z.infer<typeof CitySchema>