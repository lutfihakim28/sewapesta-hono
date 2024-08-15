import { validationMessages } from '@/constatnts/validationMessages';
import { categories } from 'db/schema/categories';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const CategoryRequestSchema = createInsertSchema(categories, {
  name: z.string({ message: validationMessages.required('Nama kategori') }),
}).pick({ name: true }).openapi('CategoryRequest')

export type CategoryRequest = z.infer<typeof CategoryRequestSchema>