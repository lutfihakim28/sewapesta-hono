import { users } from 'db/schema/users'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from '@hono/zod-openapi'

import { LocationSchema } from '@/api/public/locations/Location.schema'
import { profiles } from 'db/schema/profiles'
import { validationMessages } from '@/lib/constants/validation-message'
import { PhoneSchema } from '@/lib/schemas/Phone.schema'
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/lib/schemas/ApiResponse.schema'
import { messages } from '@/lib/constants/messages'
import { RoleEnum } from '@/lib/enums/RoleEnum'
import { SearchSchema } from '@/lib/schemas/Search.schema'
import { PaginationSchema } from '@/lib/schemas/Pagination.schema'
import { SortSchema } from '@/lib/schemas/Sort.schema'

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
  address: z.string({
    required_error: validationMessages.required('Address'),
    invalid_type_error: validationMessages.string('Address')
  }),
  name: z.string({
    required_error: validationMessages.required('Name'),
    invalid_type_error: validationMessages.string('Name')
  }),
  phone: PhoneSchema,
  subdistrictCode: z.string({
    required_error: validationMessages.required('Subdistrict'),
    invalid_type_error: validationMessages.string('Subdistrict code'),
  }).regex(/^[1-9]{2}\.[0-9]{2}\.[0-9]{2}\.[1-9][0-9]{2}[1-9]$/, {
    message: 'Should in format xx.xx.xx.xxxx'
  })
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
  oldPassword: z.string().optional(),
  newPassword: z.string({
    required_error: validationMessages.required('New password')
  }).min(8, {
    message: validationMessages.minLength('password', 8)
  })
}).openapi('UserChangePassword')

export type User = z.infer<typeof UserSchema>
export type UserExtended = z.infer<typeof UserExtendedSchema>
export type UserCreate = z.infer<typeof UserCreateSchema>
export type ProfileRequest = z.infer<typeof ProfileRequestSchema>
export type UserChangePassword = z.infer<typeof UserChangePasswordSchema>
export type UserFilter = z.infer<typeof UserFilterSchema>
export type UserRoleUpdate = z.infer<typeof UserRoleUpdateSchema>