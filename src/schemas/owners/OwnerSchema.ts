import { owners } from 'db/schema/owners';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OwnerSchema = createSelectSchema(owners).pick({
  id: true,
  name: true,
  phone: true,
  type: true,
}).openapi('Owner')

export type Owner = z.infer<typeof OwnerSchema>
