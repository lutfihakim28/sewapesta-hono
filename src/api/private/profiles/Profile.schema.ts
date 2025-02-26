import { SubdistrictExtendedSchema } from '@/api/public/locations/subdistricts/Subdistrict.schema'
import { validationMessages } from '@/lib/constants/validationMessage'
import { profiles } from 'db/schema/profiles'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const ProfileSchema = createSelectSchema(profiles)
  .pick({
    address: true,
    id: true,
    name: true,
    phone: true,
  })
  .openapi('Profile')
export const ProfileExtendedSchema = ProfileSchema.extend({
  subdistrict: SubdistrictExtendedSchema
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