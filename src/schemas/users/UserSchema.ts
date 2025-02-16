import { Branch, BranchSchema } from '@/schemas/branches/BranchSchema';
import { Profile, ProfileSchema } from '@/schemas/profiles/ProfileSchema';
import { z } from '@hono/zod-openapi'
import { users } from 'db/schema/users';
import { createSelectSchema } from 'drizzle-zod';

const _UserSchema = createSelectSchema(users)
  .pick({
    username: true,
    id: true,
    role: true,
  })

// export type User = z.infer<typeof _UserSchema> & {
//   branch: Branch;
//   profile: Profile;
// }

export const UserSchema = _UserSchema.extend({
  branch: BranchSchema,
  profile: ProfileSchema
}).openapi('User');

export type User = z.infer<typeof UserSchema>