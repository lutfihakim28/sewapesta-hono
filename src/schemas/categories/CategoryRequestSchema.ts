import { categoriesTable } from '@/db/schema/categories';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const CategoryRequestSchema = createInsertSchema(categoriesTable, {
  name: z.string({ message: 'Nama kategori harus diisi.' }),
}).pick({ name: true }).openapi('CategoryRequest')

export type CategoryRequest = z.infer<typeof CategoryRequestSchema>