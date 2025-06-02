import { users } from 'db/schema/users'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from '@hono/zod-openapi'

import { LocationSchema } from '@/api/public/locations/Location.schema'
import { profiles } from 'db/schema/profiles'
import { validationMessages } from '@/utils/constants/validation-message'
import { ApiResponseDataSchema, ApiResponseListSchema } from '@/utils/schemas/ApiResponse.schema'
import { messages } from '@/utils/constants/locales/messages'
import { RoleEnum } from '@/utils/enums/RoleEnum'
import { SearchSchema } from '@/utils/schemas/Search.schema'
import { PaginationSchema } from '@/utils/schemas/Pagination.schema'
import { SortSchema } from '@/utils/schemas/Sort.schema'
import { StringSchema } from '@/utils/schemas/String.schema'
import { ObjectSchema } from '@/utils/schemas/Object.schema'
import { SchemaType } from '@/utils/types/Schema.type'
import { EnumSchema } from '@/utils/schemas/Enum.schema'
import { BooleanSchema } from '@/utils/schemas/Boolean.schema'
import { ArraySchema } from '@/utils/schemas/Array.schema'

export type UserColumn = keyof typeof users.$inferSelect
export type ProfileColumn = keyof typeof profiles.$inferSelect

export const UserRoleSchema = new EnumSchema('User role', RoleEnum).getSchema()
export const UserRoleUpdateSchema = new ObjectSchema({
  role: new EnumSchema('Role', RoleEnum).getSchema(),
  assigned: new BooleanSchema('Assigned').getSchema(),
}).getSchema()

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
  address: new StringSchema('Address').getSchema(),
  name: new StringSchema('Name').getSchema(),
  phone: new StringSchema('Phone').phone().getSchema(),
  subdistrictCode: new StringSchema('Subdistrict code').subdistrictCode().getSchema()
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
    roles: new ArraySchema('Roles', UserRoleSchema).getSchema()
  })
  .openapi('User')

export const UserExtendedSchema = UserSchema
  .merge(ProfileExtendedSchema)
  .openapi('UserExtended')

const UserListSchema = new ArraySchema('User list', UserExtendedSchema).getSchema()

export type UserListColumn = keyof Pick<SchemaType<typeof UserExtendedSchema>, 'id' | 'name' | 'phone' | 'username'>
export const sortableUserColumns: UserListColumn[] = ['id', 'name', 'phone', 'username']

export const UserFilterSchema = SearchSchema
  .merge(PaginationSchema)
  .extend({
    role: UserRoleSchema.optional()
  })
  .merge(SortSchema(sortableUserColumns)).openapi('UserFilter')


export const UserResponseListSchema = ApiResponseListSchema(UserListSchema, messages.successList('users'))

export const UserCreateSchema = createInsertSchema(users)
  .pick({
    password: true,
    username: true
  })
  .extend({
    profile: ProfileRequestSchema,
    roles: new ArraySchema('Roles', new EnumSchema('Role', RoleEnum).getSchema()).nonempty().getSchema()
  }).openapi('UserCreate')

export const UserResponseDataSchema = ApiResponseDataSchema(UserExtendedSchema, messages.successDetail('user'))

export const UserChangePasswordSchema = new ObjectSchema({
  oldPassword: new StringSchema('Old Password').getSchema().optional(),
  newPassword: new StringSchema('Name').min(8).getSchema()
}).getSchema().openapi('UserChangePassword')

export type User = SchemaType<typeof UserSchema>
export type UserExtended = SchemaType<typeof UserExtendedSchema>
export type UserCreate = SchemaType<typeof UserCreateSchema>
export type ProfileRequest = SchemaType<typeof ProfileRequestSchema>
export type UserChangePassword = SchemaType<typeof UserChangePasswordSchema>
export type UserFilter = SchemaType<typeof UserFilterSchema>
export type UserRoleUpdate = SchemaType<typeof UserRoleUpdateSchema>