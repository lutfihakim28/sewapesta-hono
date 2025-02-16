import { z } from '@hono/zod-openapi';
import { provinces } from 'db/schema/provinces';
import { createSelectSchema } from 'drizzle-zod';

export const ProvinceSchema = createSelectSchema(provinces).openapi('Province');

export type Province = z.infer<typeof ProvinceSchema>