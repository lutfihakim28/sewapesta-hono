import { CitySchema } from '@/schemas/cities/CitySchema';
import { z } from '@hono/zod-openapi';
import { districts } from 'db/schema/districts';
import { createSelectSchema } from 'drizzle-zod';

export const DistrictSchema = createSelectSchema(districts).extend({
  city: CitySchema.optional(),
}).openapi('District')

export type District = z.infer<typeof DistrictSchema>