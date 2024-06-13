import { ownersTable } from '@/db/schema/owners';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Account, AccountSchema } from '../accounts/AccountSchema';

const _OwnerSchema = createSelectSchema(ownersTable).pick({
  id: true,
  name: true,
  phone: true,
})

export type Owner = z.infer<typeof _OwnerSchema> & {
  account: Account | null;
}

export const OwnerSchema: z.ZodType<Owner> = _OwnerSchema.extend({
  account: AccountSchema.nullable()
}).openapi('Owner');
