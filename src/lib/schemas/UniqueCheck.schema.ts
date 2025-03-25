import { z } from 'zod';
import { validationMessages } from '../constants/validationMessage';

export const UniqueCheckSchema = z.object({
  unique: z.string({
    required_error: validationMessages.required('Unique Field')
  }),
  selectedId: z.string().optional()
}).openapi('UniqueCheck')

export type UniqueCheck = z.infer<typeof UniqueCheckSchema>