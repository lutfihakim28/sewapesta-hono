import { z } from '@hono/zod-openapi';
import { validationMessages } from '../constants/validation-message';

export function NumericSchema(field: string, min?: number) {
  return z.string({
    invalid_type_error: validationMessages.string(field),
    required_error: validationMessages.required(field)
  }).regex(/^\d+(\.\d+)?$/, {
    message: validationMessages.numeric(field),
  }).refine((value) => {
    if (!min) return true;
    return Number(value) >= min;
  })
}