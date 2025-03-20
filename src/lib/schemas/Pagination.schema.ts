import { z } from 'zod';
import { validationMessages } from '../constants/validationMessage';

export const PaginationSchema = z.object({
  page: z.string({
    required_error: validationMessages.required('Page')
  }).openapi({ example: '1' }),
  pageSize: z.string().optional().openapi({ example: '10' }),
}).openapi('Pagination')