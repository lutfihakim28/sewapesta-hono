import { z } from 'zod';
import { validationMessages } from '../constants/validation-message';

export function NumericSchema(field: string) {
  return z.string({
    invalid_type_error: validationMessages.string(field),
    required_error: validationMessages.required(field)
  }).refine((val) => /^\d+(\.\d+)?$/.test(val), {
    message: validationMessages.numeric(field),
  })
}