import { z } from 'zod';
import { NumericSchema } from './Numeric.schema';

export const PaginationSchema = z.object({
  page: NumericSchema('Page').optional().openapi({ example: '1' }),
  pageSize: NumericSchema('Page size').optional().openapi({ example: '10' }),
}).openapi('Pagination')