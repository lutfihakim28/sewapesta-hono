import { validationMessages } from '@/constatnts/validationMessages';
import { z } from 'zod';

export const BadRequestSchema = z.object({
  code: z.number().openapi({
    example: 422,
  }),
  messages: z.string().array().openapi({
    example: [validationMessages.required('Nama')]
  })
}).openapi('BadRequest')