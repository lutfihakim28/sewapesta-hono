import { ownersTable } from 'db/schema/owners';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OwnerSchema = createSelectSchema(ownersTable).pick({
  id: true,
  name: true,
  phone: true,
}).openapi('Owner')

export type Owner = z.infer<typeof OwnerSchema>
