import { ownersTable } from '@/db/schema/owners';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { AccountSchema } from '../accounts/AccountSchema';

const _OwnerSchema = createSelectSchema(ownersTable).pick({
  id: true,
  name: true,
  phone: true,
})

export const OwnerSchema = _OwnerSchema.merge(z.object({
  account: AccountSchema
}).partial()).openapi('Owner');

export type Owner = z.infer<typeof OwnerSchema>