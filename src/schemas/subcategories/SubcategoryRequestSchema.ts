import { subcategoriesTable } from '@/db/schema/subcategories';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const SubcategoryRequestSchema = createInsertSchema(subcategoriesTable, {
  name: z.string({ message: 'Nama subkategori harus diisi.' }),
  categoryId: z
    .number({ message: 'ID kategori harus diisi.' })
    .positive({ message: 'ID kategori harus positif.' })
}).pick({ name: true, categoryId: true }).openapi('SubcategoryRequest')

export type SubcategoryRequest = z.infer<typeof SubcategoryRequestSchema>