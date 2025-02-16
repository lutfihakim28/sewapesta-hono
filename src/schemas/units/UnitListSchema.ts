import { messages } from '@/constants/message';
import { z } from 'zod';
import { UnitSchema } from './UnitSchema';

export const UnitListSchema = z.object({
  code: z.number().openapi({
    example: 200,
  }),
  messages: z.string().openapi({
    example: messages.successList('kendaraan'),
  }),
  data: z.array(UnitSchema),
})