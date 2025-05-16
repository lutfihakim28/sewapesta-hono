import { z } from '@hono/zod-openapi';
import { validationMessages } from '../constants/validation-message';

export function SortSchema<T extends string>(columns: T[]) {
  return z.object({
    asc: z.array(z.string(), {
      invalid_type_error: validationMessages.array('asc')
    })
      .optional()
      .transform((val) => !val ? [] : val)
      .openapi({ description: `Allowed columns are ${columns.join(', ')}`, example: [columns[0], columns[2]] }),
    desc: z.array(z.string(), {
      invalid_type_error: validationMessages.array('desc')
    })
      .optional()
      .transform((val) => !val ? [] : val)
      .openapi({ description: `Allowed columns are ${columns.join(', ')}`, example: [columns[1]] }),
  })
    .openapi('Sort')
}