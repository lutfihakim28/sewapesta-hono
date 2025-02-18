import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { VehicleSchema } from './VehicleSchema';

export const VehicleListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successList('kendaraan'),
  }),
  data: z.array(VehicleSchema),
})