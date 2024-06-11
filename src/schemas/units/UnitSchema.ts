import { unitsTable } from '@/db/schema/units';
import { createSelectSchema } from 'drizzle-zod';

export const UnitShcema = createSelectSchema(unitsTable).openapi('Unit')