import { SubdistrictExtendedSchema } from '@/api/public/locations/subdistricts/Subdistrict.schema'
import { profiles } from 'db/schema/profiles'
import { createSelectSchema } from 'drizzle-zod'

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