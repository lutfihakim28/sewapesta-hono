import { validationMessages } from '@/constatnts/validationMessages';
import { subcategoriesTable } from 'db/schema/subcategories';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const SubcategoryRequestSchema = createInsertSchema(subcategoriesTable, {
  name: z.string({ message: validationMessages.required('Nama') }),
  categoryId: z
    .number({ message: validationMessages.required('Kategori') })
}).pick({ name: true, categoryId: true }).openapi('SubcategoryRequest')

export type SubcategoryRequest = z.infer<typeof SubcategoryRequestSchema>