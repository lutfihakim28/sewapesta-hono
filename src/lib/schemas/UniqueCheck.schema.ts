import { z } from 'zod';
import { validationMessages } from '../constants/validationMessage';
import { ParamIdSchema } from './ParamId.schema';

export const UniqueCheckSchema = z.object({
  unique: z.string({
    required_error: validationMessages.required('Unique Field')
  })
}).merge(ParamIdSchema.partial()).openapi('UniqueCheck')

export type UniqueCheck = z.infer<typeof UniqueCheckSchema>