import { unitsTable } from 'db/schema/units';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const UnitSchema = createSelectSchema(unitsTable).pick({
  id: true,
  name: true,
}).openapi('Unit')

export type Unit = z.infer<typeof UnitSchema>