import { employeesTable } from '@/db/schema/employees';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const EmployeeRequestSchema = createInsertSchema(employeesTable, {
  name: z.string({ message: 'Nama karyawan wajib diisi.' }).openapi({ example: 'Budi' }),
  phone: z.string({ message: 'Nomor telepon wajib diisi.' }).openapi({ example: '628123242312' }),
}).pick({
  name: true,
  phone: true,
}).openapi('EmployeeRequest')

export type EmployeeRequest = z.infer<typeof EmployeeRequestSchema>