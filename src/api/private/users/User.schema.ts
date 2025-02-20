import { users } from 'db/schema/users'
import { createSelectSchema } from 'drizzle-zod'
import { BranchExtendedSchema } from '../branches/Branch.schema'
import { ProfileExtendedSchema } from '../profiles/Profile.schema'
import { z } from 'zod'

export const UserSchema = createSelectSchema(users)
  .pick({
    id: true,
    role: true,
    username: true,
  })
  .openapi('User')
export const UserExtendedSchema = UserSchema
  .extend({
    branch: BranchExtendedSchema,
    profile: ProfileExtendedSchema,
  })
  .openapi('UserExtended')

export type User = z.infer<typeof UserSchema>