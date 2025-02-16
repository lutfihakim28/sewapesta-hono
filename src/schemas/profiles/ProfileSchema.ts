import { z } from '@hono/zod-openapi';
import { profiles } from 'db/schema/profiles';
import { createSelectSchema } from 'drizzle-zod';

const _ProfileSchema = createSelectSchema(profiles)
  .pick({
    id: true,
    name: true,
    address: true,
    phone: true,
  })

export type Profile = z.infer<typeof _ProfileSchema> & {}

export const ProfileSchema: z.ZodType<Profile> = _ProfileSchema.extend({}).openapi('Profile')