import { subcategoriesTable } from '@/db/schema/subcategories';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const SubcategorySchema = createSelectSchema(subcategoriesTable)
  .pick({
    id: true,
    name: true,
  })
  .openapi('Subcategory')

export type Subcategory = z.infer<typeof SubcategorySchema>