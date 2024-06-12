import { categoriesTable } from '@/db/schema/categories';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { SubcategorySchema } from '../subcategories/SubcategorySchema';

const _CategorySchema = createSelectSchema(categoriesTable)

export const CategorySchema = _CategorySchema.merge(z.object({
  subcategories: z.array(SubcategorySchema)
}).partial()).openapi('Category')

export type Category = z.infer<typeof CategorySchema>