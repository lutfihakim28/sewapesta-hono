import { vehicles } from 'db/schema/vehicles';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const VehicleSchema = createSelectSchema(vehicles).pick({
  id: true,
  licenseNumber: true,
  name: true,
  vehicleType: true,
}).openapi('Vehicle')

export type Vehicle = z.infer<typeof VehicleSchema>