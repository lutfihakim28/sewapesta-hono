import { users } from 'db/schema/users'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { BranchExtendedSchema } from '../branches/Branch.schema'
import { ProfileCreateSchema, ProfileExtendedSchema, ProfileUpdateSchema } from '../profiles/Profile.schema'
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
  }).openapi('UserCreate')
export const UserUpdateSchema = UserCreateSchema.extend({
  profile: ProfileUpdateSchema
}).optional().openapi('UserUpdate')

export type User = z.infer<typeof UserSchema>
export type UserExtended = z.infer<typeof UserExtendedSchema>
export type UserCreate = z.infer<typeof UserCreateSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>