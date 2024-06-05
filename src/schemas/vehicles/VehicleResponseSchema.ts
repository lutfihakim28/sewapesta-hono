import { vehiclesTable } from '@/db/schema/vehicles';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const VehicleResponseSchema = createSelectSchema(vehiclesTable).openapi('VehicleResponseSchema')

export type VehicleResponse = z.infer<typeof VehicleResponseSchema>