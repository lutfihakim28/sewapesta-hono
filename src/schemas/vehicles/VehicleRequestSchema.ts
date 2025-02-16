import { validationMessages } from '@/constants/validationMessage';
import { vehicles } from 'db/schema/vehicles';
import { VehicleTypeEnum } from '@/enums/VehicleTypeEnum';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const VehicleRequestSchema = createInsertSchema(vehicles, {
  name: z.string({ message: validationMessages.required('Nama kendaraan') }).openapi({ example: 'Hino Dutro' }),
  licenseNumber: z.string({ message: validationMessages.required('Pelat nomor') }).openapi({ example: 'H1234IQ' }),
  vehicleType: z.enum([
    VehicleTypeEnum.Pickup,
    VehicleTypeEnum.Truck,
  ]).openapi({ example: VehicleTypeEnum.Truck })
}).pick({ name: true, licenseNumber: true, vehicleType: true }).openapi('VehicleRequestSchema');

export type VehicleRequest = z.infer<typeof VehicleRequestSchema>