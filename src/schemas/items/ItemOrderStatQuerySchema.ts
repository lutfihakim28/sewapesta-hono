import dayjs from 'dayjs';
import { z } from 'zod';

export const ItemOrderStatQuerySchema = z.object({
  year: z.string().openapi({ example: dayjs().format('YYYY') }),
})

export type ItemOrderStatQuery = z.infer<typeof ItemOrderStatQuerySchema>