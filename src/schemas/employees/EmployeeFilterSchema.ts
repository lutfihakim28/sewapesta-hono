import { employeesTable } from '@/db/schema/employees';
import { SortSchema } from '../SortSchema';
import { SearchSchema } from '../SearchSchema';
import { PaginationSchema } from '../PaginationSchema';
import { z } from 'zod';

export type EmployeeColumn = keyof typeof employeesTable.$inferSelect;

const _SortSchema = SortSchema<EmployeeColumn>([
  'createdAt',
  'id',
  'name',
  'phone',
] as const)

export const EmployeeFilterSchema = _SortSchema
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('EmployeeFilter')

export type EmployeeFilter = z.infer<typeof EmployeeFilterSchema>