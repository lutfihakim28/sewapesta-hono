import { users } from 'db/schema/users'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from '@hono/zod-openapi'

import { LocationSchema } from '@/api/public/locations/Location.schema'
import { profiles } from 'db/schema/profiles'
import { validationMessages } from '@/utils/constants/validation-message'
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema'
import { messages } from '@/utils/constants/messages'
import { RoleEnum } from '@/utils/enums/RoleEnum'
import { SearchSchema } from '@/utils/schemas/Search.schema'
import { PaginationSchema } from '@/utils/schemas/Pagination.schema'
import { SortSchema } from '@/utils/schemas/Sort.schema'
import { StringSchema } from '@/utils/schemas/String.schema'

export type UserColumn = keyof typeof users.$inferSelect
export type ProfileColumn = keyof typeof profiles.$inferSelect

export const UserRoleSchema = z.nativeEnum(RoleEnum)
export const UserRoleUpdateSchema = z.object({
  role: z.nativeEnum(RoleEnum),
  assigned: z.boolean(),
})

export const ProfileSchema = createSelectSchema(profiles)
  .pick({
    address: true,
    name: true,
    phone: true,
    subdistrictCode: true,
  })
  .openapi('Profile')

const ProfileExtendedSchema = ProfileSchema
  .omit({ subdistrictCode: true })
  .extend({
    location: LocationSchema
  }).openapi('ProfileExtended')

export const ProfileRequestSchema = createInsertSchema(profiles, {
  address: new StringSchema('Address').schema,
  name: new StringSchema('Name').schema,
  phone: new StringSchema('Phone').phone(),
  subdistrictCode: new StringSchema('Subdistrict code').subdistrictCode().schema
}).pick({
  address: true,
  name: true,
  phone: true,
  subdistrictCode: true
}).openapi('ProfileRequest')

export const UserSchema = createSelectSchema(users)
  .pick({
    id: true,
    username: true,
  })
  .extend({
    roles: z.array(UserRoleSchema)
  })
  .openapi('User')

export const UserExtendedSchema = UserSchema
  .merge(ProfileExtendedSchema)
  .openapi('UserExtended')

const UserListSchema = z.array(UserExtendedSchema)

export type UserListColumn = keyof Pick<z.infer<typeof UserExtendedSchema>, 'id' | 'name' | 'phone' | 'username'>
export const sortableUserColumns: UserListColumn[] = ['id', 'name', 'phone', 'username']

export const UserFilterSchema = z.object({
  role: UserRoleSchema.optional()
})
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .merge(SortSchema(sortableUserColumns)).openapi('UserFilter')


export const UserResponseListSchema = ApiResponseListSchema(UserListSchema, messages.successList('users'))

export const UserCreateSchema = createInsertSchema(users)
  .pick({
    password: true,
    username: true
  })
  .extend({
    profile: ProfileRequestSchema,
    roles: z.array(z.nativeEnum(RoleEnum, {
      invalid_type_error: validationMessages.enum('Role', RoleEnum),
      required_error: validationMessages.required('Role')
    }), {
      invalid_type_error: validationMessages.array('Roles'),
      required_error: validationMessages.required('Roles')
    }).nonempty('Roles can not be empty.')
  }).openapi('UserCreate')

export const UserResponseDataSchema = ApiResponseDataSchema(UserExtendedSchema, messages.successDetail('user'))

export const UserChangePasswordSchema = z.object({
  oldPassword: new StringSchema('Old Password').optional().schema,
  newPassword: new StringSchema('Name').min(8).schema
}).openapi('UserChangePassword')

export type User = z.infer<typeof UserSchema>
export type UserExtended = z.infer<typeof UserExtendedSchema>
export type UserCreate = z.infer<typeof UserCreateSchema>
export type ProfileRequest = z.infer<typeof ProfileRequestSchema>
export type UserChangePassword = z.infer<typeof UserChangePasswordSchema>
export type UserFilter = z.infer<typeof UserFilterSchema>
export type UserRoleUpdate = z.infer<typeof UserRoleUpdateSchema>