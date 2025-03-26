import { z } from '@hono/zod-openapi';
import { validationMessages } from '../constants/validation-message';
import { NumericSchema } from './Numeric.schema';

export const UniqueCheckSchema = z.object({
  unique: z.string({
    required_error: validationMessages.required('Unique Field')
  }),
  selectedId: NumericSchema('Selected ID').optional()
}).openapi('UniqueCheck')

export type UniqueCheck = z.infer<typeof UniqueCheckSchema>