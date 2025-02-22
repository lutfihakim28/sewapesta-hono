import { users } from 'db/schema/users'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { BranchExtendedSchema } from '../branches/Branch.schema'
import { ProfileCreateSchema, ProfileExtendedSchema } from '../profiles/Profile.schema'
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
export const UserCreateSchema = createInsertSchema(users)
  .pick({
    branchId: true,
    password: true,
    role: true,
    username: true
  })
  .extend({
    profile: ProfileCreateSchema
  })

export type User = z.infer<typeof UserSchema>
export type UserExtended = z.infer<typeof UserExtendedSchema>
export type UserCreate = z.infer<typeof UserCreateSchema>