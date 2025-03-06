import { users } from 'db/schema/users'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { BranchExtendedSchema } from '../branches/Branch.schema'
import { z } from 'zod'

import { LocationSchema } from '@/api/public/locations/Location.schema'
import { profiles } from 'db/schema/profiles'

export const ProfileSchema = createSelectSchema(profiles)
  .pick({
    address: true,
    id: true,
    name: true,
    phone: true,
    subdistrictCode: true,
  })
  .openapi('Profile')
export const ProfileExtendedSchema = ProfileSchema
  .omit({ subdistrictCode: true })
  .extend({
    location: LocationSchema
  }).openapi('ProfileExtended')
export const ProfileCreateSchema = createInsertSchema(profiles).pick({
  address: true,
  name: true,
  phone: true,
  subdistrictCode: true
}).openapi('ProfileCreate')
export const ProfileUpdateSchema = ProfileCreateSchema.optional().openapi('ProfileUpdate')

export type ProfilCreate = z.infer<typeof ProfileCreateSchema>
export type ProfilUpdate = z.infer<typeof ProfileUpdateSchema>

export const UserSchema = createSelectSchema(users)
  .pick({
    id: true,
    role: true,
    username: true,
    branchId: true,
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