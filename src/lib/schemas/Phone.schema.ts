import { z } from 'zod';
import { validationMessages } from '../constants/validation-message';

export const PhoneSchema = z.string({
  invalid_type_error: validationMessages.string('Phone number'),
  required_error: validationMessages.required('Phone number')
}).regex(/^\d+(\.\d+)?$/, {
  message: validationMessages.numeric('Phone number'),
}).regex(/^628[1-9][0-9]{6,9}$/, {
  message: 'Phone number should start with 628 with minimum 10 digits and maximum 13 digits.'
})