import { z } from 'zod';
import { validationMessages } from '../constants/validation-message';

export function BooleanQuerySchema(field: string) {
  return z.preprocess((value) => {
    if (value === 'true' || value === '1') return true
    if (value === 'false' || value === '0' || value === '') return false
    return value
  }, z.boolean({
    invalid_type_error: validationMessages.boolean(field),
  })).optional()
}