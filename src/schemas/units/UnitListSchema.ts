import { MESSAGES } from '@/lib/constants/MESSAGES';
import { z } from 'zod';
import { UnitSchema } from './UnitSchema';

export const UnitListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: MESSAGES.successList('kendaraan'),
  }),
  data: z.array(UnitSchema),
})