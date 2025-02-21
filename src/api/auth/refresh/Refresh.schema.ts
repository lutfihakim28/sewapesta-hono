import { validationMessages } from '@/lib/constants/validationMessage';
import { z } from 'zod';

export const RefreshRequestSchema = z.object({
  userId: z.number({
    message: validationMessages.requiredNumber('User ID')
  }).openapi({
    example: 1,
  }),
})

export type RefreshRequest = z.infer<typeof RefreshRequestSchema>