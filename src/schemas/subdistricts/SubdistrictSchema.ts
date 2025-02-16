import { DistrictSchema } from '@/schemas/districts/DistrictSchema';
import { z } from '@hono/zod-openapi';
import { subdistricts } from 'db/schema/subdistricts';
import { createSelectSchema } from 'drizzle-zod';

export const SubdistrictSchema = createSelectSchema(subdistricts).extend({
  district: DistrictSchema.optional(),
}).openapi('Subdistrict')

export type Subdistrict = z.infer<typeof SubdistrictSchema>